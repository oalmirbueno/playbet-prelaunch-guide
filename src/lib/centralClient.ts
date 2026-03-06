import { createClient } from "@supabase/supabase-js";

const CENTRAL_URL = "https://rcrrbznhatdqcmfyzgbt.supabase.co";
const CENTRAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcnJiem5oYXRkcWNtZnl6Z2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NjY2ODQsImV4cCI6MjA4ODM0MjY4NH0.iBZPiW9-3Wu7PzXVpaiJp4oxIYmqMx4HxucuSfy6G_8";

export const centralSupabase = createClient(CENTRAL_URL, CENTRAL_ANON_KEY);
