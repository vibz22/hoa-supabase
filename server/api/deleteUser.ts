import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  const body = await readBody(event)
  const { uid } = body

  // 🔐 Get token from header
  const authHeader = getHeader(event, "authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const token = authHeader.split("Bearer ")[1]

  // 🔐 Verify user
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

  // 🔍 Get role from DB
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

  // 🚫 Only admins allowed
  if (userData?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })
  }

  // 🚫 Prevent self delete
  if (uid === user.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete yourself"
    })
  }

  // 🔥 Delete auth user
  const { error: deleteError } =
    await supabase.auth.admin.deleteUser(uid)

  // Ignore if already deleted
  if (deleteError) {
    console.log(
      "AUTH DELETE ERROR:",
      deleteError.message
    )
  }

  // 🧹 Delete from users table
  const { error: dbDeleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", uid)

  if (dbDeleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: dbDeleteError.message
    })
  }

  return {
    success: true
  }
})
