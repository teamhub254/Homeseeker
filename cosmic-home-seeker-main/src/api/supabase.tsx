import { createClient } from '@supabase/supabase-js'
// DO NOT TOUCH THIS FILE WITHOUT CONSULTING
const supabaseUrl: string = 'https://gulzaakcjmwtnlycnbng.supabase.co'
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bHphYWtjam13dG5seWNuYm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTIxMjEsImV4cCI6MjA2MTM2ODEyMX0.oxf-mPciWO9_Z3IYrD1kDeqgm_Ft639Ws8nOFdTQlOc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
