// import { createClient } from '@supabase/supabase-js'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.supabaseServiceKey
//   )

//   const authHeader = getHeader(event, "authorization")
//   const token = authHeader?.split("Bearer ")[1]

//   const {
//     data: { user }
//   } = await supabase.auth.getUser(token)

//   if (!user) return { error: "Unauthorized" }

//   const { data } = await supabase
//     .from("document_access")
//     .select("documents(id, title, file_path)")
//     .eq("user_id", user.id)

//   return {
//     documents: data?.map(d => d.documents) || []
//   }
// })

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

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

  // 📄 FETCH DOCUMENT ACCESS
  const { data, error } = await supabase
    .from("document_access")
    .select(`
      documents (
        id,
        title,
        file_path
      )
    `)
    .eq("user_id", user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    documents:
      data
        ?.map(d => d.documents)
        .filter(Boolean) || []
  }
})
