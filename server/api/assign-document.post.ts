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
  const authHeader =
    getHeader(event, "authorization")

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {

    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const token =
    authHeader.split("Bearer ")[1]

  // 🔐 VERIFY USER
  const {
    data: { user },
    error: authError
  } =
    await supabase.auth.getUser(token)

  if (authError || !user) {

    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token"
    })
  }

  // 🔍 CHECK ROLE
  const {
    data: userData,
    error: roleError
  } =
    await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

  if (roleError) {

    throw createError({
      statusCode: 500,
      statusMessage:
        roleError.message
    })
  }

  // 🚫 ONLY ADMINS
  if (userData?.role !== "admin") {

    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  // ✅ ASSIGN ACCESS
  const {
    error: insertError
  } =
    await supabase
      .from("document_access")
      .insert([
        {
          document_id,
          user_id
        }
      ])

  if (insertError) {

    throw createError({
      statusCode: 500,
      statusMessage:
        insertError.message
    })
  }

  return {
    success: true
  }
})