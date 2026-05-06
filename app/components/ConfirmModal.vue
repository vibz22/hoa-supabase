<script setup>
const props = defineProps({
  show: Boolean,
  message: String
})

const emit = defineEmits(["confirm", "cancel"])
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <p>{{ message }}</p>

      <div class="actions">
        <button @click="$emit('cancel')">Cancel</button>
        <button class="danger" @click="$emit('confirm')">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

.actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.danger {
  background: #ef4444;
  color: white;
}
</style>