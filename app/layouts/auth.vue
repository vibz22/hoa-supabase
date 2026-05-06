<!-- <script setup>
import { ref } from "vue"

const mobileMenu = ref(false)
</script>

<template>
  <div class="layout">

    <header class="navbar">
      <NuxtLink to="/" class="logo">HOA App</NuxtLink>

   
      <div class="hamburger" @click="mobileMenu = !mobileMenu">
        ☰
      </div>

      
      <nav class="desktop-nav">
        <NuxtLink to="/login">Log In</NuxtLink>
        <NuxtLink to="/signup">Signup</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>

    
      <div v-if="mobileMenu" class="mobile-menu" @click.self="mobileMenu = false">
        <div class="mobile-menu-content">

          <div class="close-btn" @click="mobileMenu = false">✕</div>

          <NuxtLink to="/login" @click="mobileMenu = false">Login</NuxtLink>
          <NuxtLink to="/signup" @click="mobileMenu = false">Signup</NuxtLink>
          <NuxtLink to="/contact" @click="mobileMenu = false">Contact</NuxtLink>
          <NuxtLink to="/about" @click="mobileMenu = false">About</NuxtLink>
        </div>
      </div>
    </header>

    
    <main class="content">
      <slot />
    </main>

   
    <footer class="footer">
      <p>© 2026 HOA App • Built for gated communities</p>
    </footer>

  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #020617;
  color: white;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.content {
  flex: 1;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
  color: white;

  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;

}

.desktop-nav {
  display: flex;
  gap: 20px;
}

.desktop-nav a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500; /* 👈 key change */
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  position: relative;
}


.desktop-nav a:hover {
  color: white;
}


.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 2px;
  background: #6366f1;
  transition: width 0.25s ease;
}

.desktop-nav a:hover::after {
  width: 100%;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 30px 20px;
  background: #020617;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
}

.hamburger {
  display: none;
  font-size: 22px;
  cursor: pointer;
}


.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.mobile-menu-content {
  width: 220px;
  height: 100vh;
  background: #020617;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-menu-content a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
}

.mobile-menu-content a:hover {
  background: rgba(255,255,255,0.1);
}


.close-btn {
  align-self: flex-end;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.7);
}

.close-btn:hover {
  color: white;
}


@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .navbar {
    padding: 16px 20px;
  }
}
</style> -->

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router" // 🔥 ADDED

const mobileMenu = ref(false)

// 🔥 ADDED: detect current route
const route = useRoute()

// 🔥 ADDED: check if onboarding page (set password)
const isSetPasswordPage = computed(() => {
  return route.path === "/set-password"
})
</script>

<template>
  <div class="layout">

    <!-- 🔥 NAVBAR (HIDDEN ON SET PASSWORD PAGE) -->
    <header class="navbar">
      <NuxtLink to="/" class="logo">HOA App</NuxtLink>

      <!-- ☰ Hamburger -->
      <div class="hamburger" @click="mobileMenu = !mobileMenu">
        ☰
      </div>

      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <NuxtLink to="/login">Log In</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>

      <!-- 📱 Mobile menu -->
      <div v-if="mobileMenu" class="mobile-menu" @click.self="mobileMenu = false">
        <div class="mobile-menu-content">

          <div class="close-btn" @click="mobileMenu = false">✕</div>

          <NuxtLink to="/login" @click="mobileMenu = false">Login</NuxtLink>
          <NuxtLink to="/contact" @click="mobileMenu = false">Contact</NuxtLink>
          <NuxtLink to="/about" @click="mobileMenu = false">About</NuxtLink>
        </div>
      </div>
    </header>

    <!-- 🔥 PAGE CONTENT -->
    <main class="content">
      <slot />
    </main>

    <!-- 🔥 FOOTER (HIDDEN ON SET PASSWORD PAGE) -->
    <footer class="footer">
      <p>© 2026 HOA App • Built for gated communities</p>
    </footer>

  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #020617;
  color: white;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.content {
  flex: 1;
}

/* 🔥 NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
  color: white;

  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.desktop-nav {
  display: flex;
  gap: 20px;
}

.desktop-nav a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  position: relative;
}

.desktop-nav a:hover {
  color: white;
}

/* underline animation */
.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0%;
  height: 2px;
  background: #6366f1;
  transition: width 0.25s ease;
}

.desktop-nav a:hover::after {
  width: 100%;
}

/* 🔥 FOOTER */
.footer {
  text-align: center;
  padding: 30px 20px;
  background: #020617;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
}

/* 🔥 HAMBURGER */
.hamburger {
  display: none;
  font-size: 22px;
  cursor: pointer;
}

/* 🔥 MOBILE MENU */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.mobile-menu-content {
  width: 220px;
  height: 100vh;
  background: #020617;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-menu-content a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
}

.mobile-menu-content a:hover {
  background: rgba(255,255,255,0.1);
}

/* CLOSE BUTTON */
.close-btn {
  align-self: flex-end;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.7);
}

.close-btn:hover {
  color: white;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .navbar {
    padding: 16px 20px;
  }
}
</style>