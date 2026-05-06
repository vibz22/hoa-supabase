import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

const form = await readMultipartFormData(event)

if (!form) {
  return { error: "No form data received" }
}

  const title = form.find(f => f.name === "title")?.data.toString()
  const users = JSON.parse(form.find(f => f.name === "users")?.data.toString() || "[]")
  const file = form.find(f => f.name === "file")

  if (!file || !title) {
    return { error: "Missing fields" }
  }

  const filePath = `documents/${Date.now()}-${file.filename}`

  // upload file
  const { error: uploadError } = await supabase.storage
    .from("documents")
    // .upload(filePath, file.data)
    .upload(filePath, file.data, {
  contentType: file.type || "application/octet-stream"
})

 if (uploadError) {
  console.log("UPLOAD ERROR:", uploadError)
  return { error: uploadError.message }
}

  // insert document
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({ title, file_path: filePath })
    .select()
    .single()

  if (docError) return { error: docError.message }

  // insert access
  const accessRows = users.map((uid: string) => ({
    document_id: doc.id,
    user_id: uid
  }))

  if (accessRows.length) {
    await supabase.from("document_access").insert(accessRows)
  }

  return { success: true }
})