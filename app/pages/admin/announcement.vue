<!-- <script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue"
import { useAuth } from "~/composables/useAuth"
import { useSupabase } from "~/composables/useSupabase"

const { supabase } = useSupabase()
const { role } = useAuth()

const title = ref("")
const message = ref("")
const loading = ref(false)
const announcementList = ref<any[]>([])
const isReady = ref(false)

// ✅ Auth guard (same as yours but safer)
watchEffect(() => {
  if (role.value === undefined) return

  if (role.value !== "admin") {
    navigateTo("/")
    return
  }

  isReady.value = true
})

// 🔥 Fetch announcements
const fetchAnnouncements = async () => {
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  announcementList.value = data || []
}

// 🔥 Add announcement
const addAnnouncement = async () => {
  if (!title.value || !message.value) return

  loading.value = true

  await supabase.from("announcements").insert([
    {
      title: title.value,
      content: message.value
    }
  ])

  title.value = ""
  message.value = ""

  await fetchAnnouncements()
  loading.value = false
}

// 🔥 Delete announcement
const deleteAnnouncement = async (id: string) => {
  await supabase
    .from("announcements")
    .delete()
    .eq("id", id)

  await fetchAnnouncements()
}

// 🔥 Init + realtime
onMounted(() => {
  fetchAnnouncements()

  supabase
    .channel("announcements-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "announcements" },
      fetchAnnouncements
    )
    .subscribe()
})
</script>

<template>
  <div v-if="!isReady" class="loading">
    Loading...
  </div>

  <div v-else class="container">
    <h1>📢 Announcement Admin</h1>

    <div class="card">
      <h2>Add Announcement</h2>

      <input v-model="title" placeholder="Title" />
      <textarea v-model="message" placeholder="Message"></textarea>

      <button @click="addAnnouncement" :disabled="loading">
        {{ loading ? "Adding..." : "Add" }}
      </button>
    </div>

    <div class="card">
      <h2>Existing Announcements</h2>

      <div v-if="announcementList.length === 0">
        No announcements
      </div>

      <div v-else>
        <div v-for="a in announcementList" :key="a.id" class="item">
          <div class="content">
            <strong>{{ a.title }}</strong>
            <p>{{ a.content }}</p>
          </div>

          <button class="delete" @click="deleteAnnouncement(a.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.loading {
  text-align: center;
  margin-top: 100px;
}

.card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

input, textarea {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

button {
  background: #4f46e5;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
}

.delete {
  background: #ef4444;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
</style> -->

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAuth } from "~/composables/useAuth"
import { useSupabase } from "~/composables/useSupabase"

const { supabase } = useSupabase()
const { role, isLoaded } = useAuth()

const errorMessage = ref("")
const title = ref("")
const message = ref("")
const loading = ref(false)
const announcementList = ref<any[]>([])
const isReady = ref(false)

let channel: any = null

// 🔥 Fetch announcements
const fetchAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Fetch error:", error)
    return
  }

  announcementList.value = data || []
}

// 🔥 Add announcement
const addAnnouncement = async () => {
 errorMessage.value = ""

if (!title.value) {

  errorMessage.value =
    "❌ Please enter title"

  return
}

if (!message.value) {

  errorMessage.value =
    "❌ Please enter message"

  return
}

  loading.value = true

  const { error } = await supabase.from("announcements").insert([
    {
      title: title.value,
      content: message.value
    }
  ])

  if (error) {
    console.error("Insert error:", error)
  }

  title.value = ""
  message.value = ""

  await fetchAnnouncements()
  loading.value = false
}

// 🔥 Delete announcement
const deleteAnnouncement = async (id: string) => {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Delete error:", error)
  }

  await fetchAnnouncements()
}

// 🔐 Auth + Init (FINAL FIX)
watch(
  [role, isLoaded],
  async ([newRole, loaded]) => {
    // ⛔ wait until auth fully resolved
    if (!loaded) return

    // ⛔ redirect ONLY when we are sure
    if (newRole !== "admin") {
      navigateTo("/")
      return
    }

    // ✅ allow UI
    isReady.value = true

    // ✅ fetch once
    await fetchAnnouncements()

    // ✅ realtime once only
    if (!channel) {
      channel = supabase
        .channel("announcements-live")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "announcements" },
          fetchAnnouncements
        )
        .subscribe()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="!isReady" class="loading">
    Loading...
  </div>

  <div v-else class="container">
    <h1>📢 Announcement Admin</h1>

    <div class="card">
      <h2>Add Announcement</h2>

      <input v-model="title" placeholder="Title" />
      <textarea v-model="message" placeholder="Message"></textarea>

      <button @click="addAnnouncement" :disabled="loading">
        {{ loading ? "Adding..." : "Add" }}
      </button>

      <p
  v-if="errorMessage"
  class="error"
>
  {{ errorMessage }}
</p>
    </div>

    <div class="card">
      <h2>Existing Announcements</h2>

      <div v-if="announcementList.length === 0">
        No announcements
      </div>

      <div v-else>
        <div v-for="a in announcementList" :key="a.id" class="item">
          <div class="content">
            <strong>{{ a.title }}</strong>
            <p>{{ a.content }}</p>
          </div>

          <button class="delete" @click="deleteAnnouncement(a.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

/* ========================= */
/* CONTAINER */
/* ========================= */

.container {
  max-width: 950px;

  margin: auto;

  padding: 30px 20px;

  animation: fadeUp 0.5s ease;
}

/* ========================= */
/* TITLE */
/* ========================= */

.container h1 {
  font-size: 38px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 26px;
}

/* ========================= */
/* LOADING */
/* ========================= */

.loading {
  text-align: center;

  margin-top: 120px;

  color: #64748B;

  font-size: 16px;
}

/* ========================= */
/* CARDS */
/* ========================= */

.card {
  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  padding: 28px;

  margin-bottom: 24px;

  border-radius: 28px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.05);

  animation: fadeUp 0.7s ease;
}

/* CARD TITLE */

.card h2 {
  font-size: 22px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 18px;
}

/* ========================= */
/* INPUTS */
/* ========================= */

input,
textarea {
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

/* TEXTAREA */

textarea {
  min-height: 140px;

  resize: vertical;
}

/* FOCUS */

input:focus,
textarea:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* PLACEHOLDER */

input::placeholder,
textarea::placeholder {
  color: #94A3B8;
}

/* ========================= */
/* BUTTON */
/* ========================= */

button {
  border: none;

  padding: 14px 24px;

  border-radius: 16px;

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
    0 18px 40px rgba(37,99,235,0.2);
}

/* DISABLED */

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ========================= */
/* DELETE */
/* ========================= */

.delete {
  background: #FEE2E2;

  color: #B91C1C;

  box-shadow: none;
}

.delete:hover {
  background: #FECACA;

  box-shadow: none;
}

/* ========================= */
/* ITEMS */
/* ========================= */
.error {

  margin-top: 16px;

  padding: 14px 16px;

  border-radius: 16px;

  background: #FEE2E2;

  color: #B91C1C;

  font-size: 14px;
  font-weight: 600;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 20px;

  padding: 20px 0;

  border-bottom: 1px solid #E2E8F0;

  transition: all 0.25s ease;
}

/* HOVER */

.item:hover {
  transform: translateX(4px);
}

/* CONTENT */

.content {
  flex: 1;
}

.content strong {
  display: block;

  color: #0F172A;

  font-size: 17px;
  font-weight: 700;

  margin-bottom: 8px;
}

.content p {
  color: #64748B;

  font-size: 14px;

  line-height: 1.7;
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

  .container h1 {
    font-size: 30px;
  }

  .card {
    padding: 22px;
    border-radius: 22px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 480px) {

  .container {
    padding: 18px 12px;
  }

  .container h1 {
    font-size: 26px;
  }

  .card {
    padding: 18px;
  }

  .item {
    flex-direction: column;
    align-items: stretch;
  }

  .delete {
    width: 100%;
  }

  button {
    width: 100%;
  }

  input,
  textarea {
    padding: 14px 16px;
    font-size: 14px;
  }
}

</style>