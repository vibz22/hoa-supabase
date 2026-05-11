// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

//   const body = await readBody(event)
//   const { id } = body

//   const authHeader = getHeader(event, "authorization")
//   const token = authHeader?.split("Bearer ")[1]

//   const {
//     data: { user }
//   } = await supabase.auth.getUser(token)

//   if (!user) return { error: "Unauthorized" }

//   // 🔍 check access
//   const { data: access } = await supabase
//     .from("document_access")
//     .select("*")
//     .eq("document_id", id)
//     .eq("user_id", user.id)
//     .single()

//   if (!access) return { error: "Access denied" }

//   await supabase.from("document_logs").insert({
//   user_id: user.id,
//   document_id: id,
//   action: "view"
// })

//   // get file
//   const { data: doc, error: docError } = await supabase
//   .from("documents")
//   .select("file_path")
//   .eq("id", id)
//   .single()

// if (docError || !doc) {
//   return { error: "Document not found" }
// }

//   // signed URL
//   const { data: signed } = await supabase.storage
//     .from("documents")
//     .createSignedUrl(doc.file_path, 60)

//   return { url: signed?.signedUrl }
// })

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const body = await readBody(event)
  const { id } = body

  // 🔐 GET TOKEN
  const authHeader = getHeader(event, "authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const token = authHeader.split("Bearer ")[1]

  // 🔐 VERIFY USER
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token)

  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token"
    })
  }

  // 🔍 CHECK ACCESS
  const { data: access, error: accessError } = await supabase
    .from("document_access")
    .select("id")
    .eq("document_id", id)
    .eq("user_id", user.id)
    .single()

  if (accessError || !access) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied"
    })
  }

  // 📝 LOG VIEW
  const { error: logError } = await supabase
    .from("document_logs")
    .insert({
      user_id: user.id,
      document_id: id,
      action: "view"
    })

  if (logError) {
    console.log(
      "LOG ERROR:",
      logError.message
    )
  }

  // 📄 GET DOCUMENT
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single()

  if (docError || !doc) {
    throw createError({
      statusCode: 404,
      statusMessage: "Document not found"
    })
  }

  // 🔗 CREATE SIGNED URL
  const {
    data: signed,
    error: signedError
  } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60)

  if (signedError || !signed?.signedUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate document URL"
    })
  }

  return {
    url: signed.signedUrl
  }
})