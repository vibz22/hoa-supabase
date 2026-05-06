import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const { id } = await readBody(event)

  // 🔍 get file path
  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single()

  if (!doc) return { error: "Document not found" }

  // 🗑 delete file from storage
  await supabase.storage
    .from("documents")
    .remove([doc.file_path])

  // 🗑 delete access
  await supabase
    .from("document_access")
    .delete()
    .eq("document_id", id)

  // 🗑 delete logs (optional)
  await supabase
    .from("document_logs")
    .delete()
    .eq("document_id", id)

  // 🗑 delete document
  await supabase
    .from("documents")
    .delete()
    .eq("id", id)

  return { success: true }
})