import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const { document_id, user_id } = await readBody(event)

  await supabase
    .from("document_access")
    .delete()
    .eq("document_id", document_id)
    .eq("user_id", user_id)

  return { success: true }
})