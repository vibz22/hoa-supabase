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
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const token = authHeader.split("Bearer ")[1]

  // 🔐 Verify user via Supabase
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }

  // 🔍 Get role from DB
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userData?.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  // 🚫 Prevent self-delete
  if (uid === user.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete yourself"
    })
  }

  // 🔥 DELETE USER (Supabase Admin API)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(uid)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: deleteError.message
    })
  }

  // 🧹 Optional: delete from users table
  await supabase.from("users").delete().eq("id", uid)

  return { success: true }
})