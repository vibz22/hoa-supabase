import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export const useSupabase = (): { supabase: SupabaseClient } => {
  if (!supabase) {
    const config = useRuntimeConfig()

    supabase = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseAnonKey as string
    )
  }

  return { supabase }
}