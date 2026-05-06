import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const authHeader = getHeader(event, "authorization")
  const token = authHeader?.split("Bearer ")[1]

  const {
    data: { user }
  } = await supabase.auth.getUser(token)

  if (!user) return { error: "Unauthorized" }

  const { data } = await supabase
    .from("document_access")
    .select("documents(id, title, file_path)")
    .eq("user_id", user.id)

  return {
    documents: data?.map(d => d.documents) || []
  }
})