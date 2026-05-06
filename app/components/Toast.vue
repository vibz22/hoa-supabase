<script setup>
import { useToast } from "~/composables/useToast"

const { message, show } = useToast()
</script>

<template>
  <div v-if="show" class="toast">
    {{ message }}
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #111827;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
}
</style>