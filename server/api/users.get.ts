// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async () => {
//   const config = useRuntimeConfig()

//   // 🔐 admin-level client (like Firebase Admin)
//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

//   // 📊 fetch all users
//   const { data, error } = await supabase
//     .from('users')
//     .select('*')

//   if (error) {
//     throw createError({
//       statusCode: 500,
//       statusMessage: error.message
//     })
//   }

//   return data
// })

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  // 🔐 ADMIN CLIENT
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

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

  // 📊 FETCH USERS
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", {
      ascending: false
    })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    users: data || []
  }
})