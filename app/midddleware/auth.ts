// export default defineNuxtRouteMiddleware(async (to) => {
//   const { user, role, fetchUser } = useAuth()

//   // 🔄 ALWAYS load user + role
//   await fetchUser()

//   // ❌ not logged in
//   if (!user.value) {
//     return navigateTo("/login")
//   }

//   // 🔒 block admin access
//   if (to.path.startsWith("/admin")) {
//     if (role.value !== "admin") {
//       return navigateTo("/dashboard")
//     }
//   }
// })

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, role, fetchUser } = useAuth()

  // 🔄 ALWAYS load fresh user + role
  await fetchUser()

  console.log("USER:", user.value)
  console.log("ROLE:", role.value)

  // ❌ not logged in
  if (!user.value) {
    return navigateTo("/login")
  }

  // 🔒 protect admin routes
  if (to.path.startsWith("/admin")) {
    if (role.value !== "admin") {
      return navigateTo("/dashboard")
    }
  }
})