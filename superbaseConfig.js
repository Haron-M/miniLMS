
// 1. Initialize the Supabase Client (Fixed naming conflict)
const SUPABASE_URL = "https://krxjblifzfburywvgeqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0vU20Yh9apToYxeUdV0nXQ_JvwWTEt1";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
