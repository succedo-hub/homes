import exterior from '../assets/homes/mariehamn-exterior.jpeg';
import terrace from '../assets/homes/mariehamn-terrace.jpeg';
import livingRoom from '../assets/homes/mariehamn-living-room.jpeg';
import kitchen from '../assets/homes/mariehamn-kitchen.jpeg';
import bedroom from '../assets/homes/mariehamn-bedroom.jpeg';
import bedroomTwo from '../assets/homes/mariehamn-bedroom-2.jpeg';
import bathroom from '../assets/homes/mariehamn-bathroom.jpeg';
import droneOverviewWest from '../assets/homes/mariehamn-drone-overview-west.jpg';
import dronePropertyWest from '../assets/homes/mariehamn-drone-property-west.jpg';
import entrance from '../assets/homes/garden-flower.jpeg';
import sauna from '../assets/homes/sauna.jpeg';
import bedroomThree from '../assets/homes/mariehamn-bedroom-3.jpeg';

export const property = {
  id: '8ac83c98-0249-4b07-a657-0e29cc101001',
  slug: '4-rum-och-kok-i-parhus-i-mariehamn',
  title: '4 rum och kök i parhus i Mariehamn',
  location: 'Svärtesgränd, Västernäs, Mariehamn',
  rent: 1290,
  salePrice: 245000,
  listingTypes: ['sale', 'rent'],
  rooms: '4 rum och kök',
  area: 'cirka 94,1 m²',
  totalArea: 'cirka 98 m² inklusive teknikrum',
  bedrooms: 3,
  available: 'Inflyttning från 1 december 2026 eller enligt överenskommelse.',
  tenure: 'Till salu och för uthyrning',
  intro: 'Ett bekvämt boende i ett plan med ljusa sociala ytor, tre separata sovrum, egen uteplats med bastu (gemensam i bolaget som består av två lägenheter) och ett lugnt läge vid återvändsgränd i Västernäs Mariehamn.',
  facts: [
    ['Bolag', 'Bostads Ab Svärtan i Mariehamn'],
    ['Bolagets ekonomi', 'Skuldfritt bolag'],
    ['Vederlag', '2,80 €/m² per månad'],
    ['Hyra', '1 290 €/månad'],
    ['Uppsägningstid', '2 månader'],
    ['I hyran ingår', 'Värme, vatten och sophantering'],
    ['Utöver hyran', 'Bruksel tillkommer'],
    ['Inflyttningsår', '2016'],
    ['Våningsplan', '2'],
    ['Sovrum', '3 separata sovrum, varav master bedroom har eget förråd/closet med fönster'],
    ['Tomt', 'Legotomt, Mariehamns stad'],
    ['Uteplats', 'Egen uteplats i västerläge'],
    ['Förvaring', 'Möjlighet att anlägga kallförråd under trappan samt viss förvaring i teknikrummet'],
    ['Värme', 'Vattenburen golvvärme via fjärrvärme'],
    ['Ventilation', 'Badrumsfläkt och ventiler i fönstren'],
    ['Vatten och avlopp', 'Anslutning till stadens nät'],
    ['Fiber', 'Anslutning till Ålcoms fibernät'],
    ['Bilplats', 'En bilplats med eluttag. Möjlighet att parkera på gården samt avtala om ytterligare bilplats inom bolaget'],
  ] as const,
  gallery: [
    { src: droneOverviewWest, alt: 'Drönarvy rakt ovanifrån över parhusområdet i Västernäs' },
    { src: dronePropertyWest, alt: 'Drönarvy över parhuset, den egna uteplatsen och trädgården i västerläge' },
    { src: entrance, alt: 'Entrén till bostaden med stenläggning och blommande grönska' },
    { src: sauna, alt: 'Den fristående gemensamma bastun med träpanel, lavar och elaggregat' },
    { src: bedroom, alt: 'Ljust sovrum fotograferat med befintlig möblering' },
    { src: exterior, alt: 'Parhusets mörka träfasad och den egna gräsmattan' },
    { src: terrace, alt: 'Stenlagd uteplats i västerläge med plats för matgrupp och samvaro' },
    { src: livingRoom, alt: 'Ljust vardagsrum och matplats i öppen planlösning' },
    { src: kitchen, alt: 'Vitt kök med arbetsbänk, keramikhäll och fönster; lös inredning på bilden ingår inte' },
    { src: bedroomThree, alt: 'Sovrum 3 med plats för säng och arbetsplats' },
    { src: bedroomTwo, alt: 'Mindre sovrum med plats för säng' },
    { src: bathroom, alt: 'Badrum med kakel, klinker, glasdusch och belyst spegel; lös inredning på bilden ingår inte' },
  ],
} as const;

export type Property = typeof property;
