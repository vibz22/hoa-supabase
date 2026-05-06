// import { useState } from "#app"
// import type { User } from "@supabase/supabase-js"

// export const useAuth = () => {
//   const supabase = useNuxtApp().$supabase



// const user = useState<User | null>("user", () => null)
// const role = useState<string | null>("role", () => null)

//   const fetchUser = async () => {
//     try {
//       // 🔐 get auth user
//       const {
//         data: { user: u }
//       } = await supabase.auth.getUser()

//       user.value = u

//       if (u) {
//         // 🔥 get role from DB
//         const { data, error } = await supabase
//           .from("users")
//           .select("role")
//           .eq("id", u.id)
//           .single()

//         if (error) {
//           console.error("ROLE ERROR:", error)
//           role.value = null
//         } else {
//           role.value = data?.role || null
//         }
//       } else {
//         role.value = null
//       }

//     } catch (err) {
//       console.error("AUTH ERROR:", err)
//       user.value = null
//       role.value = null
//     }
//   }

//   return {
//     user,
//     role,
//     fetchUser
//   }
// }

import { useState } from "#app"
import type { User } from "@supabase/supabase-js"

export const useAuth = () => {
  const supabase = useNuxtApp().$supabase

  // ✅ undefined = loading
  const user = useState<User | null | undefined>("user", () => undefined)
  const role = useState<string | null | undefined>("role", () => undefined)
  const isLoaded = useState<boolean>("auth_loaded", () => false)

  const fetchUser = async () => {
    try {
      // 🔐 get auth user
      const {
        data: { user: u }
      } = await supabase.auth.getUser()

      user.value = u

      if (u) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", u.id)
          .single()

        if (error) {
          console.error("ROLE ERROR:", error)
          role.value = null
        } else {
          role.value = data?.role || null
        }
      } else {
        role.value = null
      }

    } catch (err) {
      console.error("AUTH ERROR:", err)
      user.value = null
      role.value = null
    } finally {
      // ✅ mark auth as resolved
      isLoaded.value = true
    }
  }

  return {
    user,
    role,
    isLoaded,
    fetchUser
  }
}