import { createClient } from '@supabase/supabase-js'

let supabaseAdmin: any = null

export const getSupabaseAdmin = () => {
  const config = useRuntimeConfig()


  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey
    )
  }

  return supabaseAdmin
}