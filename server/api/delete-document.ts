// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

//   const { id } = await readBody(event)

//   // 🔍 get file path
//   const { data: doc } = await supabase
//     .from("documents")
//     .select("file_path")
//     .eq("id", id)
//     .single()

//   if (!doc) return { error: "Document not found" }

//   // 🗑 delete file from storage
//   await supabase.storage
//     .from("documents")
//     .remove([doc.file_path])

//   // 🗑 delete access
//   await supabase
//     .from("document_access")
//     .delete()
//     .eq("document_id", id)

//   // 🗑 delete logs (optional)
//   await supabase
//     .from("document_logs")
//     .delete()
//     .eq("document_id", id)

//   // 🗑 delete document
//   await supabase
//     .from("documents")
//     .delete()
//     .eq("id", id)

//   return { success: true }
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

  // 🔐 VERIFY TOKEN
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

  // 🔍 CHECK ROLE
  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (roleError) {
    throw createError({
      statusCode: 500,
      statusMessage: roleError.message
    })
  }

  // 🚫 ONLY ADMINS
  if (userData?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  // 🔍 GET DOCUMENT
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

  // 🗑 DELETE FILE FROM STORAGE
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([doc.file_path])

  if (storageError) {
    console.log(
      "STORAGE DELETE ERROR:",
      storageError.message
    )
  }

  // 🗑 DELETE ACCESS
  const { error: accessError } = await supabase
    .from("document_access")
    .delete()
    .eq("document_id", id)

  if (accessError) {
    throw createError({
      statusCode: 500,
      statusMessage: accessError.message
    })
  }

  // 🗑 DELETE LOGS
  const { error: logsError } = await supabase
    .from("document_logs")
    .delete()
    .eq("document_id", id)

  if (logsError) {
    throw createError({
      statusCode: 500,
      statusMessage: logsError.message
    })
  }

  // 🗑 DELETE DOCUMENT
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: deleteError.message
    })
  }

  return {
    success: true
  }
})
