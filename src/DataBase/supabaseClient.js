import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pivsauoqqjuiowbedbay.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdnNhdW9xcWp1aW93YmVkYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTgyNzIsImV4cCI6MjA4MjYzNDI3Mn0.2E8Py9SBqHeNkbAoc0aMju16cPICpkImjuWkeLZ4O7I"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
