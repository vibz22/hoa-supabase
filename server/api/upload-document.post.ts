// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

// const form = await readMultipartFormData(event)

// if (!form) {
//   return { error: "No form data received" }
// }

//   const title = form.find(f => f.name === "title")?.data.toString()
//   const users = JSON.parse(form.find(f => f.name === "users")?.data.toString() || "[]")
//   const file = form.find(f => f.name === "file")

//   if (!file || !title) {
//     return { error: "Missing fields" }
//   }

//   const filePath = `documents/${Date.now()}-${file.filename}`

//   // upload file
//   const { error: uploadError } = await supabase.storage
//     .from("documents")
//     // .upload(filePath, file.data)
//     .upload(filePath, file.data, {
//   contentType: file.type || "application/octet-stream"
// })

//  if (uploadError) {
//   console.log("UPLOAD ERROR:", uploadError)
//   return { error: uploadError.message }
// }

//   // insert document
//   const { data: doc, error: docError } = await supabase
//     .from("documents")
//     .insert({ title, file_path: filePath })
//     .select()
//     .single()

//   if (docError) return { error: docError.message }

//   // insert access
//   const accessRows = users.map((uid: string) => ({
//     document_id: doc.id,
//     user_id: uid
//   }))

//   if (accessRows.length) {
//     await supabase.from("document_access").insert(accessRows)
//   }

//   return { success: true }
// })

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

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

  // 📦 READ FORM DATA
  const form = await readMultipartFormData(event)

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "No form data received"
    })
  }

  const title = form
    .find(f => f.name === "title")
    ?.data.toString()

  const users = JSON.parse(
    form.find(f => f.name === "users")
      ?.data.toString() || "[]"
  )

  const file = form.find(f => f.name === "file")

  if (!file || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields"
    })
  }

  // 📁 SAFER FILE PATH
  const cleanName = file.filename
    ?.replace(/\s+/g, "-")

  const filePath =
    `documents/${Date.now()}-${cleanName}`

  // ⬆️ UPLOAD FILE
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file.data, {
      contentType:
        file.type || "application/octet-stream"
    })

  if (uploadError) {
    throw createError({
      statusCode: 500,
      statusMessage: uploadError.message
    })
  }

  // 📝 INSERT DOCUMENT
  const {
    data: doc,
    error: docError
  } = await supabase
    .from("documents")
    .insert({
      title,
      file_path: filePath
    })
    .select()
    .single()

  // 🔥 CLEANUP FILE IF DB INSERT FAILS
  if (docError || !doc) {

    await supabase.storage
      .from("documents")
      .remove([filePath])

    throw createError({
      statusCode: 500,
      statusMessage:
        docError?.message ||
        "Failed to create document"
    })
  }

  // 👥 INSERT ACCESS
  const accessRows = users.map((uid: string) => ({
    document_id: doc.id,
    user_id: uid
  }))

  if (accessRows.length) {

    const { error: accessError } = await supabase
      .from("document_access")
      .insert(accessRows)

    if (accessError) {
      throw createError({
        statusCode: 500,
        statusMessage: accessError.message
      })
    }
  }

  return {
    success: true
  }
})