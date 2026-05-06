<script setup>
import { onMounted } from "vue"
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>