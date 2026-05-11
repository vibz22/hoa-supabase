```vue
<script setup>
definePageMeta({
  layout: "auth"
})

import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const message = ref("")
const invalidLink = ref(false)

onMounted(async () => {
  try {

    // Handles Supabase invite/password recovery links
    const { error } = await supabase.auth.exchangeCodeForSession(
      window.location.href
    )

    if (error) {
      invalidLink.value = true
      message.value =
        "⚠️ This invite link is invalid or expired. Please request a new invite."
      return
    }

    // Verify session exists
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      invalidLink.value = true
      message.value =
        "⚠️ Unable to establish session. Please request a new invite."
    }

  } catch (err) {
    invalidLink.value = true
    message.value =
      "⚠️ Invalid or expired invite link."
  }
})

const setPassword = async () => {

  if (!password.value || !confirmPassword.value) {
    message.value = "❌ Please fill all fields"
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = "❌ Passwords do not match"
    return
  }

  if (password.value.length < 6) {
    message.value =
      "❌ Password must be at least 6 characters"
    return
  }

  loading.value = true
  message.value = ""

  const { error } = await supabase.auth.updateUser({
    password: password.value
  })

  if (error) {
    message.value = "❌ " + error.message
  } else {
    message.value =
      "✅ Password set successfully! Redirecting..."

    setTimeout(() => {
      navigateTo("/dashboard")
    }, 1500)
  }

  loading.value = false
}
</script>
```
