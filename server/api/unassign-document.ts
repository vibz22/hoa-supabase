// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

//   const { document_id, user_id } = await readBody(event)

//   await supabase
//     .from("document_access")
//     .delete()
//     .eq("document_id", document_id)
//     .eq("user_id", user_id)

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

  const {
    document_id,
    user_id
  } = body

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

  // 🗑 REMOVE ACCESS
  const { error: deleteError } = await supabase
    .from("document_access")
    .delete()
    .eq("document_id", document_id)
    .eq("user_id", user_id)

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