<script setup>
// Public homepage (no auth required)
definePageMeta({
  layout: "public"
})
</script>

<template>
  <div class="home">

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-content">
        <span class="badge">Modern HOA Platform</span>

        <h2>Smart HOA Management System</h2>

        <p>
          Manage your community, communicate with residents,
          and handle maintenance — all in one modern platform.
        </p>

        <div class="actions">
         

          <NuxtLink to="/login" class="btn primary">
            Log In
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features">

      <div class="card">
        <div class="icon">📢</div>
        <h3>Announcements</h3>
        <p>
          Keep all homeowners updated instantly with notices,
          events, and community updates.
        </p>
      </div>

      <div class="card">
        <div class="icon">🛠️</div>
        <h3>Maintenance</h3>
        <p>
          Track repairs, complaints, and maintenance requests
          in one place.
        </p>
      </div>

      <div class="card">
        <div class="icon">👥</div>
        <h3>Community</h3>
        <p>
          Connect with neighbors and improve engagement across
          your society.
        </p>
      </div>

      <div class="card">
        <div class="icon">📄</div>
        <h3>Documents</h3>
        <p>
          Access bylaws, invoices, reports, and important
          files anytime.
        </p>
      </div>

    </section>

  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

.home {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: #F8FAFC;
}

/* HERO */

.hero {
  position: relative;
  overflow: hidden;

  padding: 120px 20px;

  background:
    linear-gradient(
      rgba(248,250,252,0.94),
      rgba(248,250,252,0.96)
    ),
    url("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600");

  background-size: cover;
  background-position: center;
}

.hero-content {
  max-width: 850px;
  margin: auto;
  text-align: center;
}

.badge {
  display: inline-block;

  background: #DBEAFE;
  color: #2563EB;

  padding: 8px 14px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 600;

  margin-bottom: 24px;
}

.hero h2 {
  font-size: 56px;
  line-height: 1.1;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 20px;
}

.hero p {
  max-width: 680px;

  margin: auto;

  color: #475569;

  font-size: 18px;
  line-height: 1.8;
}

/* BUTTONS */

.actions {
  margin-top: 40px;

  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;

  padding: 14px 26px;

  border-radius: 14px;

  font-size: 15px;
  font-weight: 600;

  transition: all 0.25s ease;
}

.primary {
  background: #2563EB;
  color: white;

  box-shadow:
    0 10px 25px rgba(37,99,235,0.18);
}

.primary:hover {
  background: #1D4ED8;
  transform: translateY(-2px);
}

.secondary {
  background: white;
  color: #0F172A;

  border: 1px solid #CBD5E1;
}

.secondary:hover {
  background: #F1F5F9;
}

/* FEATURES */

.features {
  padding: 80px 40px;

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(240px, 1fr));

  gap: 24px;

  max-width: 1300px;
  margin: auto;
}

/* CARDS */

.card {
  background: white;

  padding: 30px;

  border-radius: 24px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 10px 30px rgba(0,0,0,0.03);

  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);

  box-shadow:
    0 15px 40px rgba(0,0,0,0.06);
}

.icon {
  font-size: 34px;
  margin-bottom: 18px;
  color: #0F172A;
}

.card h3 {
  font-size: 20px;
  font-weight: 700;

  color: #0F172A;

  margin-bottom: 12px;
}

.card p {
  color: #64748B;

  font-size: 15px;
  line-height: 1.7;
}

/* TABLET */

@media (max-width: 768px) {

  .hero {
    padding: 90px 20px;
  }

  .hero h2 {
    font-size: 38px;
  }

  .hero p {
    font-size: 16px;
  }

  .features {
    padding: 50px 20px;
  }
}

/* MOBILE */

@media (max-width: 480px) {

  .hero {
    padding: 70px 16px;
  }

  .hero h2 {
    font-size: 30px;
  }

  .hero p {
    font-size: 15px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 260px;
    text-align: center;
  }

  .features {
    grid-template-columns: 1fr;
    padding: 40px 16px;
  }

  .card {
    padding: 24px;
  }
}

</style>