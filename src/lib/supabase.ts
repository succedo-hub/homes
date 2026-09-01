import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ngbcrhldwuwfopenfstu.supabase.co';
export const supabasePublishableKey = 'sb_publishable_EyFC2FW0dhb1EpQSSMn3ig_cs6LkE0F';
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
