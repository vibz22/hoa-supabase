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

// ✅ ADDED REALTIME CHANNEL
let announcementChannel = null
let maintenanceChannel = null

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

  // ✅ REALTIME ANNOUNCEMENTS
  if (!announcementChannel) {

    announcementChannel = supabase
      .channel("homeowner-announcements")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements"
        },

        async () => {
          await fetchData()
        }
      )

      .subscribe()
  }

  // ✅ REALTIME MAINTENANCE
if (!maintenanceChannel) {

  maintenanceChannel = supabase
    .channel("homeowner-maintenance")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "maintenance_requests"
      },

      async () => {
        await fetchData()
      }
    )

    .subscribe()
}
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
    <div class="welcome card-glass">
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

      <NuxtLink
        :to="role === 'admin' ? '/admin/documents' : '/documents'"
        class="card action"
      >
        📄 Documents
      </NuxtLink>

      <NuxtLink to="/community" class="card action">
        💬 Community
      </NuxtLink>

      <NuxtLink to="/profile" class="card action">
        👤 Profile
      </NuxtLink>

      <NuxtLink
        v-if="role === 'admin'"
        to="/admin"
        class="card action admin"
      >
        🛡 Admin Panel
      </NuxtLink>

      <NuxtLink
        v-if="role === 'admin'"
        to="/admin/announcement"
        class="card action admin"
      >
        📢 Add Announcement
      </NuxtLink>

      <NuxtLink
        v-if="role === 'admin'"
        to="/admin/maintenance"
        class="card action admin"
      >
        🛠 Add Maintenance
      </NuxtLink>

      <NuxtLink
        v-if="role === 'admin'"
        to="/admin/document-logs"
        class="card action admin"
      >
        👁 Document Logs
      </NuxtLink>

      <NuxtLink
        v-if="role === 'admin'"
        to="/admin/document-list"
        class="card action admin"
      >
        📂 Document list
      </NuxtLink>

    </div>

    <!-- 🔥 Content Sections -->
    <div class="content-grid">

      <!-- Announcements -->
      <div class="section card-glass">

        <h2>Latest Announcements</h2>

        <div v-if="loading">
          Loading...
        </div>

        <div v-else-if="announcements.length === 0">
          No announcements yet
        </div>

        <div v-else>

          <div
            class="item"
            v-for="a in announcements"
            :key="a.id"
          >
            <h3>{{ a.title }}</h3>

            <p>{{ a.content }}</p>
          </div>

        </div>

      </div>

      <!-- Maintenance -->
      <div class="section card-glass">

        <h2>Maintenance / Repairs</h2>

        <div v-if="maintenance.length === 0">
          No maintenance updates
        </div>

        <div v-else>

          <div
            class="item"
            v-for="m in maintenance"
            :key="m.id"
          >
            <strong>{{ m.title }}</strong>

            <p>{{ m.content }}</p>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

.dashboard {
  max-width: 1400px;
  margin: auto;

  padding: 30px 24px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  min-height: 100vh;

  background: #F8FAFC;
}

/* ========================= */
/* GLASS SYSTEM */
/* ========================= */

.card-glass {
  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid #E2E8F0;

  border-radius: 24px;

  box-shadow:
    0 4px 20px rgba(15,23,42,0.05);
}

/* ========================= */
/* WELCOME */
/* ========================= */

.welcome {
  padding: 34px;
}

.welcome h1 {
  font-size: 34px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 8px;
}

.welcome p {
  color: #64748B;
  font-size: 16px;
}

/* ========================= */
/* ACTION GRID */
/* ========================= */

.grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(220px, 1fr));

  gap: 18px;
}

/* ACTION CARDS */

.action {
  position: relative;

  padding: 24px;

  border-radius: 22px;

  text-decoration: none;

  color: #0F172A;

  font-weight: 700;

  background: white;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 4px 20px rgba(15,23,42,0.04);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;

  overflow: hidden;

  animation: fadeUp 0.6s ease forwards;
}

/* Hover */

.action:hover {
  transform: translateY(-6px);

  box-shadow:
    0 18px 40px rgba(37,99,235,0.12);

  background: #FFFFFF;
}

/* Blue top glow */

.action::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: linear-gradient(
    90deg,
    #2563EB,
    #60A5FA
  );
}

/* Admin cards */

.admin {
  background: #FEF2F2;

  border: 1px solid #FECACA;
}

.admin::before {
  background: linear-gradient(
    90deg,
    #EF4444,
    #F87171
  );
}

/* ========================= */
/* CONTENT GRID */
/* ========================= */

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 24px;
}

/* SECTIONS */

.section {
  padding: 28px;

  max-height: 520px;

  overflow-y: auto;
}

.section h2 {
  font-size: 22px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 22px;
}

/* ITEMS */

.item {
  padding: 18px 0;

  border-bottom: 1px solid #E2E8F0;

  transition: all 0.25s ease;
}

.item:hover {
  transform: translateX(4px);
}

.item h3,
.item strong {
  color: #0F172A;

  font-size: 16px;
}

.item p {
  margin-top: 8px;

  color: #64748B;

  font-size: 14px;
  line-height: 1.7;
}

/* ========================= */
/* SCROLLBAR */
/* ========================= */

.section::-webkit-scrollbar {
  width: 8px;
}

.section::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 999px;
}

/* ========================= */
/* ANIMATIONS */
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

@media (max-width: 992px) {

  .content-grid {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 24px 18px;
  }

  .welcome h1 {
    font-size: 28px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 600px) {

  .grid {
    grid-template-columns: 1fr;
  }

  .welcome {
    padding: 24px;
  }

  .welcome h1 {
    font-size: 24px;
  }

  .section {
    padding: 22px;
    max-height: 380px;
  }

  .section h2 {
    font-size: 18px;
  }

  .action {
    padding: 20px;
    border-radius: 18px;
  }
}

</style>