<script setup>
// Public homepage (no auth required)
definePageMeta({
  layout: "public"
})

import { ref } from "vue"

</script>

<template>
  <div class="home">

    <!-- 🔥 HERO SECTION -->
    <section class="hero">
      <h2>Smart HOA Management System</h2>
      <p>
        Manage your community, communicate with residents,
        and handle maintenance — all in one place.
      </p>

      <div class="actions">
       

        <NuxtLink to="/login" class="btn secondary">
          Log In
        </NuxtLink>
      </div>
    </section>

    <!-- 🔥 FEATURES -->
    <section class="features">
      <div class="card">
        <h3>📢 Announcements</h3>
        <p>Keep all homeowners updated instantly.</p>
      </div>

      <div class="card">
        <h3>🛠 Maintenance</h3>
        <p>Track repairs and community issues.</p>
      </div>

      <div class="card">
        <h3>👥 Community</h3>
        <p>Connect with neighbors and stay informed.</p>
      </div>

      <div class="card">
        <h3>📄 Documents</h3>
        <p>Access bylaws and important files anytime.</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #020617;
}

/* 🔥 NAVBAR (glass + clean) */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 20px;
  font-weight: 600;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 14px;
  transition: 0.2s ease;
}

nav a:hover {
  color: white;
}

/* 🔥 HERO (premium gradient + glow) */
.hero {
  /* flex: 1;
  text-align: center;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;

  background: radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(168,85,247,0.2), transparent 40%),
              linear-gradient(135deg, #020617, #0f172a, #1e293b); */
               min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background: 
    linear-gradient(rgba(2,6,23,0.7), rgba(2,6,23,0.9)),
    url("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600");

  background-size: cover;
  background-position: center;

  text-align: center;
  color: white;
  padding: 40px 20px;
}

/* glow effects */
.hero::before,
.hero::after {
  content: "";
  position: absolute;
  filter: blur(80px);
  z-index: 0;
}

.hero::before {
  width: 500px;
  height: 500px;
  background: rgba(99,102,241,0.4);
  top: -120px;
  left: -120px;
}

.hero::after {
  width: 400px;
  height: 400px;
  background: rgba(168,85,247,0.35);
  bottom: -120px;
  right: -120px;
}

/* keep text above glow */
.hero * {
  position: relative;
  z-index: 1;
}

.hero h2 {
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.hero p {
  color: rgba(255,255,255,0.7);
  max-width: 600px;
  margin: auto;
  font-size: 16px;
  line-height: 1.6;
}

/* buttons */
.actions {
  margin-top: 30px;
}

.btn {
  display: inline-block;
  padding: 12px 22px;
  margin: 6px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.primary {
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: white;
  box-shadow: 
    0 8px 25px rgba(99,102,241,0.4),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 30px rgba(99,102,241,0.5);
}

.secondary {
  background: rgba(255,255,255,0.08);
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
}

.secondary:hover {
  background: rgba(255,255,255,0.12);
}

/* 🔥 FEATURES (glass cards) */
.features {
  padding: 60px 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;

  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  padding: 24px;
  border-radius: 16px;
  text-align: left;
  color: white;

  border: 1px solid rgba(255,255,255,0.06);

  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.card h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.card p {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}

/* 🔥 FOOTER */
.footer {
  text-align: center;
  padding: 30px 20px;
  background: #020617;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
}

/* 📱 TABLET */
@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px;
    flex-wrap: wrap;
  }

  nav {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero {
    padding: 80px 20px;
  }

  .hero h2 {
    font-size: 28px;
  }

  .hero p {
    font-size: 14px;
  }

  .features {
    padding: 40px 20px;
  }
}

/* 📲 MOBILE */
@media (max-width: 480px) {
  .hero {
    padding: 60px 16px;
  }

  .hero h2 {
    font-size: 22px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 260px;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

/* 🔥 Hamburger */
.hamburger {
  display: none;
  font-size: 22px;
  cursor: pointer;
}

/* Mobile menu overlay */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

/* Menu panel */
.mobile-menu-content {
  width: 220px;
    height: 100vh;
  min-height: 100vh;
  background: #020617;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Links */
.mobile-menu-content a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
}

.mobile-menu-content a:hover {
  background: rgba(255,255,255,0.1);
}

/* ===================== */
/* 📱 MOBILE ONLY */
/* ===================== */
@media (max-width: 768px) {

  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: block;
  }
}
</style>