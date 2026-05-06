<script setup>
import { onMounted, ref } from "vue"
import { useAuth } from "~/composables/useAuth"

definePageMeta({
  layout: 'default'
})

const supabase = useNuxtApp().$supabase

// ✅ use global auth (like Firebase)
const { user, role, loading, fetchUser } = useAuth()

const announcements = ref([])
const maintenance = ref([])
const name = ref("")
const profileLoading = ref(true)

// 📦 DATA
const fetchData = async () => {
  try {
    const { data: ann } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    announcements.value = ann || []

    const { data: maint } = await supabase
      .from("maintenance_requests")
      .select("*")
      .order("created_at", { ascending: false })

    maintenance.value = maint || []

  } catch (err) {
    console.error("DATA ERROR:", err)
  }
}

//fetch users to add names in welcome
const fetchProfile = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.value.id)
    .single()

  if (data) {
    name.value = data.name
  }
  profileLoading.value = false

  if (error) {
    console.error("PROFILE ERROR:", error)
  }
}

// 🚀 INIT
onMounted(async () => {
  await fetchUser()

  // 🔒 protect route (replaces middleware)
  if (!user.value) {
    return navigateTo("/login")
  }

  await fetchData()
  await fetchProfile() 
})

// 🚪 LOGOUT
const logout = async () => {
  await supabase.auth.signOut()
  navigateTo("/login")
}
</script>

<template>
  <div class="dashboard">

    <!-- 🔥 Welcome -->
    <div class="welcome">
      <!-- <h1>Welcome {{ name || user?.email }}</h1> -->
       <h1 v-if="!profileLoading">
  Welcome {{ name || user?.email }}
</h1>

<h1 v-else>
  Loading...
</h1>
      <p>
        {{ role === "admin" ? "Admin Panel Access" : "Homeowner Portal" }}
      </p>
    </div>

    <!-- 🔥 Quick Actions -->
    <div class="grid">
      <NuxtLink to="/documents" class="card">📄 Documents</NuxtLink>
      <NuxtLink to="/community" class="card">💬 Community Board</NuxtLink>
      <NuxtLink to="/profile" class="card">👤 Profile</NuxtLink>

      <NuxtLink v-if="role === 'admin'" to="/admin" class="card admin">
        🛡 Admin Panel
      </NuxtLink>

      <NuxtLink v-if="role === 'admin'" to="/admin/announcement" class="card admin">
        📢 Add Announcement
      </NuxtLink>

      <NuxtLink v-if="role === 'admin'" to="/admin/maintenance" class="card admin">
        🛠 Add Maintenance
      </NuxtLink>
    </div>

    <!-- 🔥 Announcements -->
    <div class="section">
      <h2>Latest Announcements</h2>

      <div v-if="loading">Loading...</div>

      <div v-else-if="announcements.length === 0">
        No announcements yet
      </div>

      <div v-else>
        <div v-for="a in announcements" :key="a.id">
          <h3>{{ a.title }}</h3>
          <p>{{ a.content }}</p>
        </div>
      </div>
    </div>

    <!-- 🔥 Maintenance -->
    <div class="section">
      <h2>Maintenance / Repairs</h2>

      <div v-if="maintenance.length === 0">
        No maintenance updates
      </div>

      <div v-else>
        <div v-for="m in maintenance" :key="m.id">
          <strong>{{ m.title }}</strong>
          <p>{{ m.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Welcome */
.welcome {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.welcome h1 {
  font-size: 28px;
  margin-bottom: 5px;
}

.welcome p {
  color: #6b7280;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

/* Cards */
.card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  text-align: center;
  text-decoration: none;
  color: #111827;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.admin {
  background: #fee2e2;
}

/* Sections */
.section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.section h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

/* Items */
.section div > div {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

/* Logout */
.logout {
  margin-top: 10px;
  padding: 14px;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.logout:hover {
  background: #dc2626;
}
</style>