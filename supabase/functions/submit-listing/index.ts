import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.4";

const allowedOrigins = new Set([
  "https://homes.ax",
  "https://www.homes.ax",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);
const allowedPropertyTypes = new Set(["apartment", "house", "terraced_house", "semi_detached", "cottage", "plot", "other"]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const response = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
  },
});

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const number = (value: unknown) => value === "" || value === null || value === undefined ? null : Number(value);
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? "";
  if (!allowedOrigins.has(origin)) return response("https://homes.ax", { error: "Otillåtet ursprung." }, 403);
  if (request.method === "OPTIONS") return response(origin, { ok: true });
  if (request.method !== "POST") return response(origin, { error: "Metoden stöds inte." }, 405);
  if (Number(request.headers.get("content-length") ?? 0) > 100_000) return response(origin, { error: "Förfrågan är för stor." }, 413);

  try {
    const body = await request.json();
    if (text(body.website, 200)) return response(origin, { ok: true });

    const listingTypes = Array.isArray(body.listingTypes)
      ? [...new Set(body.listingTypes.filter((type: unknown) => type === "sale" || type === "rent"))]
      : [];
    const propertyType = text(body.propertyType, 40);
    const title = text(body.title, 140);
    const streetAddress = text(body.streetAddress, 160);
    const locality = text(body.locality, 100) || "Mariehamn";
    const description = text(body.description, 8000);
    const contactName = text(body.contactName, 120);
    const contactEmail = text(body.contactEmail, 320).toLowerCase();
    const rooms = number(body.rooms);
    const livingArea = number(body.livingArea);
    const salePrice = number(body.salePrice);
    const monthlyRent = number(body.monthlyRent);
    const privacyConsent = body.privacyConsent === true;
    const images = Array.isArray(body.images) ? body.images.slice(0, 10) : [];

    const invalid = listingTypes.length === 0 || !allowedPropertyTypes.has(propertyType) || title.length < 8 || streetAddress.length < 2 || description.length < 80 || contactName.length < 2 || !/^\S+@\S+\.\S+$/.test(contactEmail) || !privacyConsent || !rooms || rooms <= 0 || !livingArea || livingArea <= 0 || (listingTypes.includes("sale") && (!salePrice || salePrice <= 0)) || (listingTypes.includes("rent") && (!monthlyRent || monthlyRent <= 0));
    if (invalid) return response(origin, { error: "Kontrollera de obligatoriska fälten och försök igen." }, 400);
    if (images.some((image: { type?: unknown; size?: unknown }) => !allowedImageTypes.has(String(image.type)) || Number(image.size) > 8_388_608)) return response(origin, { error: "Bilder måste vara JPG, PNG eller WebP och högst 8 MB styck." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return response(origin, { error: "Tjänsten saknar serverkonfiguration." }, 500);
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { count } = await supabase.from("listing_contacts").select("listing_id", { count: "exact", head: true }).eq("contact_email", contactEmail).gte("created_at", since);
    if ((count ?? 0) >= 3) return response(origin, { error: "För många annonser har skickats från denna e-postadress idag. Försök igen senare." }, 429);

    const id = crypto.randomUUID();
    const slug = `${slugify(title).slice(0, 90) || "bostad"}-${id.slice(0, 8)}`;
    const listing = {
      id,
      status: "pending",
      listing_types: listingTypes,
      property_type: propertyType,
      title,
      slug,
      street_address: streetAddress,
      district: text(body.district, 100) || null,
      locality,
      rooms,
      bedrooms: number(body.bedrooms),
      living_area: livingArea,
      total_area: number(body.totalArea),
      floor: text(body.floor, 30) || null,
      construction_year: number(body.constructionYear),
      description,
      features: Array.isArray(body.features) ? body.features.map((item: unknown) => text(item, 100)).filter(Boolean).slice(0, 20) : [],
      sale_price: listingTypes.includes("sale") ? salePrice : null,
      monthly_rent: listingTypes.includes("rent") ? monthlyRent : null,
      available_from: text(body.availableFrom, 10) || null,
      availability_note: text(body.availabilityNote, 500) || null,
    };

    const { error: listingError } = await supabase.from("listings").insert(listing);
    if (listingError) throw listingError;
    const { error: contactError } = await supabase.from("listing_contacts").insert({
      listing_id: id,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: text(body.contactPhone, 60) || null,
      privacy_consent: true,
    });
    if (contactError) {
      await supabase.from("listings").delete().eq("id", id);
      throw contactError;
    }

    const uploads: Array<{ path: string; token: string }> = [];
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index] as { type: string };
      const extension = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
      const path = `submissions/${id}/${String(index + 1).padStart(2, "0")}-${crypto.randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage.from("listing-images").createSignedUploadUrl(path);
      if (error) throw error;
      uploads.push({ path, token: data.token });
    }

    if (uploads.length) {
      const { error: imageError } = await supabase.from("listing_images").insert(uploads.map((upload, index) => ({ listing_id: id, storage_path: upload.path, alt_text: `${title}, bild ${index + 1}`, sort_order: index })));
      if (imageError) throw imageError;
    }

    return response(origin, { ok: true, listingId: id, uploads }, 201);
  } catch (error) {
    // eslint-disable-next-line no-console -- Edge Function logs are required for operational diagnostics.
    console.error("submit-listing", error);
    return response(origin, { error: "Annonsen kunde inte sparas. Försök igen eller kontakta oss." }, 500);
  }
});
