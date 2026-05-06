<!-- <script setup>
import { useAuth } from "~/composables/useAuth"
import { useRoute } from "vue-router"
import { onMounted } from "vue"

const { user, role, fetchUser } = useAuth()
const route = useRoute()
const supabase = useNuxtApp().$supabase
const showDropdown = ref(false)

onMounted(async () => {
  if (!user.value) {
    await fetchUser()
  }
})

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo("/login")
}

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script> -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useAuth } from "~/composables/useAuth"
import { useRoute } from "vue-router"

const { user, role, fetchUser } = useAuth()
const route = useRoute()
const supabase = useNuxtApp().$supabase
const sidebarOpen = ref(false)

const showDropdown = ref(false)

const handleOutsideClick = () => {
  showDropdown.value = false
}

onMounted(() => {
  window.addEventListener("click", handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener("click", handleOutsideClick)
})

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo("/login")
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>


<template>
  <!-- <div class="layout">
    <aside class="sidebar">
      <h2>HOA App</h2>

      <nav>
        <NuxtLink to="/profile">Profile</NuxtLink>
        <NuxtLink
          to="/dashboard"
          :class="{ active: route.path === '/dashboard' }"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          v-if="role === 'admin'"
          to="/admin"
          :class="{ active: route.path === '/admin' }"
        >
          Admin
        </NuxtLink>
      </nav>

      <button class="logout" @click="logout">Logout</button>
    </aside>

    <div class="main">
      <header class="topbar">
        <span>Welcome</span>

    
        <div class="user-menu">
  <div class="user">
    <div class="avatar">
      {{ user?.email?.charAt(0).toUpperCase() }}
    </div>
    <span>{{ user?.email }}</span>
  </div>

  <div class="dropdown">
    <NuxtLink to="/profile">Edit Profile</NuxtLink>
    <button @click="logout">Logout</button>
  </div>
</div>
      </header>

      <div class="content">
        <slot />
          <Toast />
      </div>
    </div>
  </div> -->

  <!-- 🔥 SIDEBAR -->   
 
  <div class="layout">

    <!-- 🔥 SIDEBAR -->
    <aside :class="['sidebar', { open: sidebarOpen }]">
      <button class="close-btn" @click="sidebarOpen = false">✕</button>
      <h2>HOA App</h2>

      <nav>
        <NuxtLink to="/profile" @click="sidebarOpen = false">Profile</NuxtLink>

        <NuxtLink
          to="/dashboard"
          :class="{ active: route.path === '/dashboard' }"
          @click="sidebarOpen = false"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          v-if="role === 'admin'"
          to="/admin"
          :class="{ active: route.path === '/admin' }"
          @click="sidebarOpen = false"
        >
          Admin
        </NuxtLink>
        <NuxtLink
          v-if="role === 'admin'"
          to="/admin/invite"
          :class="{ active: route.path === '/admin/invite' }"
          @click="sidebarOpen = false"
        >
          Invite User
        </NuxtLink>
      </nav>

      <button class="logout" @click="logout">Logout</button>
    </aside>

    <!-- 🔥 OVERLAY -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>

    <!-- 🔥 MAIN -->
    <div class="main">

      <header class="topbar">
        <div class="mobile-menu" @click="toggleSidebar">☰</div>

        <span>Welcome</span>

        <div class="user-menu">
          <div class="user" @click.stop="showDropdown = !showDropdown">
            <div class="avatar">
              {{ user?.email?.charAt(0).toUpperCase() }}
            </div>
            <span>{{ user?.email }}</span>
          </div>

          <div class="dropdown" :class="{ open: showDropdown }" @click.stop>
            <NuxtLink to="/profile">Edit Profile</NuxtLink>
            <button @click="logout">Logout</button>
          </div>
        </div>
      </header>

      <div class="content">
        <slot />
        <Toast />
      </div>

    </div>
  </div>
</template>

<style scoped>

/* ========================= */
/* RESET */
/* ========================= */

html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;

  background: #F8FAFC;
}

* {
  box-sizing: border-box;
}

/* ========================= */
/* ROOT LAYOUT */
/* ========================= */

.layout {
  display: flex;

  min-height: 100vh;

  background: #F8FAFC;
}

/* ========================= */
/* SIDEBAR */
/* ========================= */

.sidebar {
  width: 260px;

  flex-shrink: 0;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border-right: 1px solid #E2E8F0;

  padding: 24px 18px;

  display: flex;
  flex-direction: column;

  transition: transform 0.3s ease;

  z-index: 1001;
}

.sidebar h2 {
  font-size: 28px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 30px;
}

/* NAV */

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* LINKS */

.sidebar a {
  display: flex;
  align-items: center;

  padding: 14px 16px;

  border-radius: 16px;

  text-decoration: none;

  color: #475569;

  font-weight: 600;

  transition:
    background 0.25s ease,
    transform 0.25s ease,
    color 0.25s ease;
}

/* HOVER */

.sidebar a:hover {
  background: #EFF6FF;

  color: #2563EB;

  transform: translateX(4px);
}

/* ACTIVE */

.sidebar a.active {
  background: #2563EB;

  color: white;

  box-shadow:
    0 10px 25px rgba(37,99,235,0.18);
}

/* LOGOUT */

.logout {
  margin-top: auto;

  width: 100%;

  padding: 14px;

  border: none;

  border-radius: 16px;

  background: #EF4444;

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.logout:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 25px rgba(239,68,68,0.22);
}

/* ========================= */
/* MAIN */
/* ========================= */

.main {
  flex: 1;

  display: flex;
  flex-direction: column;

  min-width: 0;

  background: #F8FAFC;
}

/* ========================= */
/* TOPBAR */
/* ========================= */

.topbar {
  position: sticky;
  top: 0;

  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 24px;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border-bottom: 1px solid #E2E8F0;
}

/* TITLE */

.topbar span {
  color: #0F172A;

  font-size: 16px;
  font-weight: 700;
}

/* ========================= */
/* MOBILE MENU */
/* ========================= */

.mobile-menu {
  display: none;

  font-size: 24px;

  cursor: pointer;

  color: #0F172A;
}

/* ========================= */
/* USER */
/* ========================= */

.user-menu {
  position: relative;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;

  padding: 8px 12px;

  border-radius: 14px;

  transition: background 0.25s ease;
}

.user:hover {
  background: #F1F5F9;
}

/* AVATAR */

.avatar {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: #2563EB;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}

/* EMAIL */

.user span {
  color: #0F172A;

  font-size: 14px;
  font-weight: 600;
}

/* ========================= */
/* DROPDOWN */
/* ========================= */

.dropdown {
  position: absolute;

  top: 110%;
  right: 0;

  min-width: 200px;

  background: white;

  border-radius: 18px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 18px 40px rgba(15,23,42,0.08);

  overflow: hidden;

  opacity: 0;
  transform: translateY(10px);

  pointer-events: none;

  transition: all 0.25s ease;
}

/* OPEN */

.dropdown.open {
  opacity: 1;

  transform: translateY(0);

  pointer-events: auto;
}

/* ITEMS */

.dropdown a,
.dropdown button {
  width: 100%;

  display: block;

  padding: 14px 18px;

  border: none;

  background: white;

  text-align: left;

  text-decoration: none;

  color: #334155;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: background 0.25s ease;
}

/* HOVER */

.dropdown a:hover,
.dropdown button:hover {
  background: #F8FAFC;
}

/* ========================= */
/* CONTENT */
/* ========================= */

.content {
  flex: 1;

  width: 100%;

  padding: 26px;

  max-width: 1400px;

  margin: 0 auto;
}

/* ========================= */
/* OVERLAY */
/* ========================= */

.overlay {
  position: fixed;
  inset: 0;

  background: rgba(15,23,42,0.4);

  z-index: 1000;

  backdrop-filter: blur(2px);
}

/* ========================= */
/* CLOSE BUTTON */
/* ========================= */

.close-btn {
  display: none;
}

/* ========================= */
/* TABLET */
/* ========================= */

@media (max-width: 992px) {

  .sidebar {
    width: 240px;
  }

  .content {
    padding: 20px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 768px) {

  .mobile-menu {
    display: block;
  }

  .sidebar {
    position: fixed;

    top: 0;
    left: 0;

    height: 100dvh;

    overflow-y: auto;

    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main {
    width: 100%;
  }

  .content {
    padding: 16px;

    max-width: 100%;
  }

  .topbar {
    padding: 14px 16px;
  }

  .user span {
    display: none;
  }

  /* CLOSE BTN */

  .close-btn {
    display: flex;

    position: absolute;

    top: 14px;
    right: 14px;

    width: 34px;
    height: 34px;

    align-items: center;
    justify-content: center;

    border: none;

    border-radius: 10px;

    background: #F1F5F9;

    color: #0F172A;

    cursor: pointer;
  }
}

/* ========================= */
/* SMALL MOBILE */
/* ========================= */

@media (max-width: 480px) {

  .sidebar {
    width: 85%;
  }

  .topbar {
    gap: 10px;
  }

  .content {
    padding: 14px;
  }
}

</style>