<script setup>
// Public homepage (no auth required)
definePageMeta({
  layout: "public"
})

import { ref } from "vue"


</script>

<template>
  <div class="home">

<section class="about">
  <h2>About the System</h2>
  <p>
    The Society Management System is a web-based platform designed to simplify
    everyday operations of residential communities. It provides a centralized
    solution for administrators and residents to manage communication,
    maintenance, and community engagement efficiently.
  </p>

  <p>
    Admins can manage announcements, maintenance updates, and users with
    role-based access control, while residents can stay informed, interact
    with the community, and manage their profiles — all from a single dashboard.
  </p>
</section>

<!-- 🔥 WHAT WE DO -->
<section class="what-we-do">
  <h2>What We Do</h2>

  <div class="grid">
    <div class="card">
      <h3>📢 Communication</h3>
      <p>Real-time announcements and updates from admins.</p>
    </div>

    <div class="card">
      <h3>🛠 Maintenance</h3>
      <p>Track maintenance updates and community issues.</p>
    </div>

    <div class="card">
      <h3>👥 User Management</h3>
      <p>Secure role-based access and user control.</p>
    </div>

    <div class="card">
      <h3>📊 Dashboard</h3>
      <p>Centralized view of all important updates.</p>
    </div>

    <div class="card">
      <h3>💬 Community</h3>
      <p>Engage and interact with residents.</p>
    </div>

    <div class="card">
      <h3>👤 Profile</h3>
      <p>Manage personal information easily.</p>
    </div>
  </div>
</section>

<!-- 🔥 COMING SOON -->
<section class="coming-soon">
  <h2>Coming Soon</h2>

  <div class="grid">
    <div class="card">
      <h3>🗳 Community Voting</h3>
      <p>Empower residents to vote on important decisions and actively shape their community.</p>
    </div>

    <div class="card">
      <h3>📄 Document Sharing</h3>
      <p>Access important society files anytime.</p>
    </div>

    <div class="card">
      <h3>🎉 Events</h3>
      <p>Organize and participate in community events.</p>
    </div>
  </div>
</section>
  </div>
</template>

<style scoped>

*{
  box-sizing:border-box;
}

/* ========================= */
/* PAGE */
/* ========================= */

.home{
  min-height:100vh;

  background:
  linear-gradient(
    135deg,
    #f8fafc,
    #eef2ff,
    #f8fafc
  );
}

/* ========================= */
/* SECTIONS */
/* ========================= */

.about,
.what-we-do,
.coming-soon{
  max-width:1200px;

  margin:auto;

  padding:90px 20px 20px;
}

/* ========================= */
/* TITLES */
/* ========================= */

.about h2,
.what-we-do h2,
.coming-soon h2{
  text-align:center;

  font-size:48px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:24px;

  animation:fadeUp 0.5s ease;
}

/* ========================= */
/* ABOUT TEXT */
/* ========================= */

.about p{
  max-width:850px;

  margin:18px auto;

  text-align:center;

  color:#64748b;

  font-size:16px;

  line-height:1.9;

  animation:fadeUp 0.7s ease;
}

/* ========================= */
/* GRID */
/* ========================= */

.grid{
  display:grid;

  grid-template-columns:
  repeat(3, minmax(0, 1fr));

  gap:24px;

  margin-top:40px;
}

/* ========================= */
/* CARD */
/* ========================= */

.card{
  background:rgba(255,255,255,0.82);

  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);

  border:1px solid #e2e8f0;

  border-radius:28px;

  padding:28px;

  box-shadow:
  0 10px 35px rgba(15,23,42,0.05);

  transition:0.3s ease;

  animation:fadeUp 0.6s ease;
}

/* HOVER */

.card:hover{
  transform:translateY(-6px);

  box-shadow:
  0 20px 45px rgba(37,99,235,0.08);
}

/* ========================= */
/* CARD TITLE */
/* ========================= */

.card h3{
  font-size:22px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:14px;

  line-height:1.5;
}

/* ========================= */
/* CARD TEXT */
/* ========================= */

.card p{
  color:#64748b;

  font-size:15px;

  line-height:1.8;
}

/* ========================= */
/* SECTION SPACING */
/* ========================= */

.what-we-do{
  padding-top:40px;
}

.coming-soon{
  padding-top:40px;
  padding-bottom:80px;
}

/* ========================= */
/* SPECIAL COMING SOON */
/* ========================= */

.coming-soon .card{
  position:relative;

  overflow:hidden;
}

.coming-soon .card::before{
  content:"Coming Soon";

  position:absolute;

  top:16px;
  right:-38px;

  padding:6px 40px;

  background:
  linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color:white;

  font-size:11px;
  font-weight:700;

  transform:rotate(40deg);
}

/* ========================= */
/* ANIMATION */
/* ========================= */

@keyframes fadeUp{

  from{
    opacity:0;
    transform:translateY(24px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* ========================= */
/* TABLET */
/* ========================= */

@media(max-width:900px){

  .about h2,
  .what-we-do h2,
  .coming-soon h2{
    font-size:38px;
  }
  .grid{
    grid-template-columns:repeat(2,1fr);
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media(max-width:600px){

  .about,
  .what-we-do,
  .coming-soon{
    padding:70px 14px 20px;
  }

  .about h2,
  .what-we-do h2,
  .coming-soon h2{
    font-size:30px;
  }

  .about p{
    font-size:14px;
  }

  .grid{
    grid-template-columns:1fr;
  }

  .card{
    padding:22px;

    border-radius:24px;
  }

  .card h3{
    font-size:20px;
  }

  .card p{
    font-size:14px;
  }

  .coming-soon{
    padding-bottom:50px;
  }
}

</style>