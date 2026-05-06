import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const body = await readBody(event)
  const { id } = body

  const authHeader = getHeader(event, "authorization")
  const token = authHeader?.split("Bearer ")[1]

  const {
    data: { user }
  } = await supabase.auth.getUser(token)

  if (!user) return { error: "Unauthorized" }

  // 🔍 check access
  const { data: access } = await supabase
    .from("document_access")
    .select("*")
    .eq("document_id", id)
    .eq("user_id", user.id)
    .single()

  if (!access) return { error: "Access denied" }

  await supabase.from("document_logs").insert({
  user_id: user.id,
  document_id: id,
  action: "view"
})

  // get file
  const { data: doc, error: docError } = await supabase
  .from("documents")
  .select("file_path")
  .eq("id", id)
  .single()

if (docError || !doc) {
  return { error: "Document not found" }
}

  // signed URL
  const { data: signed } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60)

  return { url: signed?.signedUrl }
})