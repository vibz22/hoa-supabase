import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  // 🔐 admin-level client (like Firebase Admin)
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  // 📊 fetch all users
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return data
})