import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

    console.log("SERVICE KEY:", config.supabaseServiceKey)
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // 🔐 service role key (important)
  )

  const body = await readBody(event)
  const { email, name, role } = body

  // 🔐 VERIFY ADMIN (same as your delete logic)
  const authHeader = getHeader(event, "authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const token = authHeader.split("Bearer ")[1]

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" })
  }

  // 🔍 Check role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userData?.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" })
  }

  // 🔍 Check if user already exists
const { data: existingUser } = await supabase
  .from("users")
  .select("id")
  .eq("email", email)
  .maybeSingle()

if (existingUser) {
  return {
    error: "User already registered"
  }
}
  // 🔥 INVITE USER
  const { data, error: inviteError } =
    // await supabase.auth.admin.inviteUserByEmail(email)
    await supabase.auth.admin.inviteUserByEmail(email, {
  redirectTo: "http://localhost:3000/set-password"
})

if (inviteError) {
  if (inviteError.message.toLowerCase().includes("already")) {
    return { error: "User already registered" }
  }

  return { error: inviteError.message }
}

  const userId = data.user?.id

  // 🔥 INSERT INTO USERS TABLE
  const { error: insertError } = await supabase
    .from("users")
    .insert({
      id: userId,
      email,
      name,
      role
    })

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: insertError.message
    })
  }

  return { success: true }
})