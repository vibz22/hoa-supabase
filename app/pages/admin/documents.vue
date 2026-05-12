<script setup>
import { ref, onMounted, watchEffect, watch, computed } from "vue"
import { useAuth } from "~/composables/useAuth"

const { role } = useAuth()
const supabase = useNuxtApp().$supabase

const title = ref("")
const file = ref(null)
const users = ref([])
const selectedUsers = ref([])
const loading = ref(false)
const message = ref("")
const userSearch = ref("")
const selectAll = ref(false)

watch(selectAll, (val) => {
  if (val) {
    selectedUsers.value = filteredUsers.value.map(u => u.id)
  } else {
    const filteredIds = filteredUsers.value.map(u => u.id)
    selectedUsers.value = selectedUsers.value.filter(
      id => !filteredIds.includes(id)
    )
  }
})

watchEffect(() => {
  if (role.value === undefined) return
  if (role.value !== "admin") navigateTo("/")
})

const fetchUsers = async () => {
  const { data } = await supabase
    .from("users")
    .select("id, name, email")

  users.value = data || []
}
const handleFileChange = (event) => {

  const selected =
    event.target.files?.[0]

  file.value =
    selected || null
}

const upload = async () => {
  if (!title.value) {

  message.value = "❌ Please enter title"

  return
}

if (!file.value) {

  message.value = "❌ Please select file"

  return
}

if (selectedUsers.value.length === 0) {

  message.value =
    "❌ Please select at least one user"

  return
}

  loading.value = true
  message.value = ""

  try {
    const form = new FormData()
    form.append("title", title.value)
    form.append("file", file.value)
    form.append("users", JSON.stringify(selectedUsers.value))

    const { data } = await supabase.auth.getSession()

    const res = await $fetch("/api/upload-document", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.session.access_token}`
      },
      body: form
    })

    if (res?.error) {
      message.value = "❌ " + res.error
    } else {
      message.value = "✅ Uploaded!"
    }

  } catch (err) {
    message.value = "❌ Upload failed"
  }

  loading.value = false
}

const filteredUsers = computed(() => {
  return users.value.filter(u =>
    (u.name || u.email)
      .toLowerCase()
      .includes(userSearch.value.toLowerCase())
  )
})

onMounted(fetchUsers)
</script>

<template>
  <div class="container">
    <div class="box">

      <h1>Upload Document</h1>
      <p class="subtitle">Assign access to users</p>

      <input v-model="title" placeholder="Document Title" />
      <!-- <input type="file" @change="e => file.value = e.target.files[0]" /> -->
      <input type="file" @change="handleFileChange" />
      <h3>Select Users</h3>

      <input v-model="userSearch" placeholder="Search users..." />

      <!-- SELECT ALL + COUNT -->
      <div class="users-header">
        <label class="select-all">
          <input type="checkbox" v-model="selectAll" />
          <span>Select All</span>
        </label>

        <span class="count">
          {{ selectedUsers.length }} selected
        </span>
      </div>

      <!-- USERS -->
      <div class="users">
        <label v-for="u in filteredUsers" :key="u.id" class="user">
          <input type="checkbox" :value="u.id" v-model="selectedUsers" />
          <span class="user-text">
            {{ u.name || u.email }}
          </span>
        </label>

        <div v-if="filteredUsers.length === 0" class="no-users">
          No users found
        </div>
      </div>

      <button @click="upload" :disabled="loading">
        {{ loading ? "Uploading..." : "Upload Document" }}
      </button>

      <p v-if="message">{{ message }}</p>

    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

/* ========================= */
/* PAGE */
/* ========================= */

.container {
  min-height: 100vh;

  display: flex;
  justify-content: center;

  padding: 30px 20px;

  background: #F8FAFC;
}

/* ========================= */
/* BOX */
/* ========================= */

.box {
  width: 100%;
  max-width: 620px;

  height: fit-content;

  padding: 34px;

  border-radius: 30px;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.05);

  animation: fadeUp 0.5s ease;
}

/* ========================= */
/* TITLE */
/* ========================= */

h1 {
  font-size: 38px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 10px;
}

/* SUBTITLE */

.subtitle {
  color: #64748B;

  margin-bottom: 28px;

  font-size: 15px;
}

/* SECTION TITLE */

h3 {
  margin-top: 24px;
  margin-bottom: 12px;

  font-size: 16px;
  font-weight: 700;

  color: #0F172A;
}

/* ========================= */
/* INPUTS */
/* ========================= */

input {
  width: 100%;

  margin-bottom: 16px;

  padding: 16px 18px;

  border-radius: 16px;

  border: 1px solid #CBD5E1;

  background: white;

  color: #0F172A;

  font-size: 15px;

  outline: none;

  transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

/* FILE INPUT */

input[type="file"] {
  padding: 14px;
  cursor: pointer;
}

/* FOCUS */

input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* PLACEHOLDER */

input::placeholder {
  color: #94A3B8;
}

/* ========================= */
/* USERS HEADER */
/* ========================= */

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 12px;
}

/* SELECT ALL */

.select-all {
  display: flex;
  align-items: center;

  gap: 10px;

  cursor: pointer;

  font-weight: 600;

  color: #334155;
}

/* FIX CHECKBOX */

.select-all input {
  width: 18px;
  height: 18px;

  margin: 0;
}

/* COUNT */

.count {
  color: #2563EB;

  font-size: 14px;
  font-weight: 700;
}

/* ========================= */
/* USERS */
/* ========================= */

.users {
  max-height: 240px;

  overflow-y: auto;

  padding: 10px;

  border-radius: 20px;

  background: #F8FAFC;

  border: 1px solid #E2E8F0;

  margin-bottom: 22px;
}

/* USER */

.user {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 12px 14px;

  border-radius: 14px;

  cursor: pointer;

  transition:
    background 0.25s ease,
    transform 0.25s ease;
}

/* HOVER */

.user:hover {
  background: white;

  transform: translateX(2px);
}

/* CHECKBOX */

.user input {
  width: 18px;
  height: 18px;

  margin: 0;
}

/* USER TEXT */

.user-text {
  color: #0F172A;

  font-size: 14px;
  font-weight: 600;
}

/* NO USERS */

.no-users {
  text-align: center;

  padding: 20px;

  color: #94A3B8;

  font-size: 14px;
}

/* ========================= */
/* BUTTON */
/* ========================= */

button {
  width: 100%;

  padding: 16px;

  border: none;

  border-radius: 18px;

  background: #2563EB;

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  box-shadow:
    0 10px 25px rgba(37,99,235,0.18);
}

/* HOVER */

button:hover {
  background: #1D4ED8;

  transform: translateY(-2px);

  box-shadow:
    0 18px 40px rgba(37,99,235,0.22);
}

/* DISABLED */

button:disabled {
  opacity: 0.7;

  cursor: not-allowed;

  transform: none;
}

/* ========================= */
/* MESSAGE */
/* ========================= */

p:last-child {
  margin-top: 16px;

  text-align: center;

  font-size: 14px;
  font-weight: 600;

  color: #2563EB;
}

/* ========================= */
/* SCROLLBAR */
/* ========================= */

.users::-webkit-scrollbar {
  width: 8px;
}

.users::-webkit-scrollbar-thumb {
  background: #CBD5E1;

  border-radius: 999px;
}

/* ========================= */
/* ANIMATION */
/* ========================= */

@keyframes fadeUp {

  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================= */
/* TABLET */
/* ========================= */

@media (max-width: 768px) {

  .container {
    padding: 24px 16px;
  }

  .box {
    padding: 28px;

    border-radius: 24px;
  }

  h1 {
    font-size: 30px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 480px) {

  .container {
    padding: 18px 12px;
  }

  .box {
    padding: 22px;

    border-radius: 22px;
  }

  h1 {
    font-size: 26px;
  }

  input,
  button {
    padding: 14px 16px;

    font-size: 14px;
  }

  .users {
    max-height: 200px;
  }

  .users-header {
    flex-direction: column;
    align-items: flex-start;

    gap: 10px;
  }
}

</style>