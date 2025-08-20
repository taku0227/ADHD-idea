import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://odklxdlsqkucrqamdpnc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka2x4ZGxzcWt1Y3JxYW1kcG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjczMTIsImV4cCI6MjA3MTIwMzMxMn0.Ya5m6WMeGmb40tZvRuGJMAWdcPJKgfDauX9JpBtB8RE";

export const supabase = createClient(supabaseUrl, supabaseKey);
