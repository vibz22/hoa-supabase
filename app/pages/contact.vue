<script setup>
// Public homepage (no auth required)
definePageMeta({
  layout: "public"
})

import { ref } from "vue"

const mobileMenu = ref(false)
</script>

<template>
  <div class="contact">

    <section class="contact-hero">
      <h2>Contact Us</h2>
      <p>
        Have questions, feedback, or suggestions? We’d love to hear from you.
        Reach out and we’ll get back to you as soon as possible.
      </p>
    </section>

    <section class="contact-container">

      <!-- 🔥 Info -->
      <div class="contact-info card">
        <h3>Get in Touch</h3>

        <p><strong>Email:</strong> support@test.com</p>
        <p><strong>Phone:</strong> +xxx xxxx xxx</p>
        <p><strong>Location:</strong> Your City</p>

        <p class="note">
          This is currently a prototype system. For now, you can reach out for
          feedback, feature requests, or any queries related to the platform.
        </p>
      </div>

      <!-- 🔥 Form -->
      <div class="contact-form card">
        <h3>Send a Message</h3>

        <form @submit.prevent>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="4" placeholder="Your Message"></textarea>

          <button class="btn primary">Send Message</button>
        </form>
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

.contact{
  min-height:100vh;

  background:
  linear-gradient(
    135deg,
    #f8fafc,
    #eef2ff,
    #f8fafc
  );

  padding-bottom:60px;
}

/* ========================= */
/* HERO */
/* ========================= */

.contact-hero{
  text-align:center;

  padding:90px 20px 50px;
}

.contact-hero h2{
  font-size:48px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:16px;

  animation:fadeUp 0.5s ease;
}

.contact-hero p{
  max-width:720px;

  margin:auto;

  color:#64748b;

  font-size:16px;

  line-height:1.9;

  animation:fadeUp 0.7s ease;
}

/* ========================= */
/* LAYOUT */
/* ========================= */

.contact-container{
  max-width:1200px;

  margin:auto;

  display:grid;

  grid-template-columns:1fr 1.1fr;

  gap:28px;

  padding:0 20px;
}

/* ========================= */
/* CARDS */
/* ========================= */

.card{
  background:rgba(255,255,255,0.82);

  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);

  border:1px solid #e2e8f0;

  border-radius:30px;

  padding:34px;

  box-shadow:
  0 10px 35px rgba(15,23,42,0.05);

  animation:fadeUp 0.6s ease;

  transition:0.3s ease;
}

.card:hover{
  transform:translateY(-4px);

  box-shadow:
  0 18px 40px rgba(37,99,235,0.08);
}

/* ========================= */
/* TITLES */
/* ========================= */

.card h3{
  font-size:28px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:24px;
}

/* ========================= */
/* INFO */
/* ========================= */

.contact-info p{
  color:#475569;

  font-size:15px;

  line-height:1.9;

  margin-bottom:14px;
}

.contact-info strong{
  color:#0f172a;
}

/* NOTE */

.note{
  margin-top:24px;

  padding:18px;

  border-radius:18px;

  background:#eff6ff;

  color:#2563eb !important;

  font-size:14px !important;

  line-height:1.8;
}

/* ========================= */
/* FORM */
/* ========================= */

.contact-form form{
  display:flex;
  flex-direction:column;

  gap:16px;
}

/* INPUTS */

.contact-form input,
.contact-form textarea{
  width:100%;

  border:none;

  outline:none;

  padding:16px 18px;

  border-radius:18px;

  background:white;

  font-size:15px;

  color:#0f172a;

  border:1px solid #cbd5e1;

  transition:0.25s ease;
}

/* TEXTAREA */

.contact-form textarea{
  min-height:140px;

  resize:none;
}

/* PLACEHOLDER */

.contact-form input::placeholder,
.contact-form textarea::placeholder{
  color:#94a3b8;
}

/* FOCUS */

.contact-form input:focus,
.contact-form textarea:focus{
  border-color:#2563eb;

  box-shadow:
  0 0 0 4px rgba(37,99,235,0.12);

  transform:translateY(-1px);
}

/* ========================= */
/* BUTTON */
/* ========================= */

.btn{
  border:none;

  cursor:pointer;

  transition:0.25s ease;
}

.primary{
  width:100%;

  padding:16px;

  border-radius:20px;

  background:
  linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color:white;

  font-size:15px;
  font-weight:700;

  box-shadow:
  0 12px 30px rgba(37,99,235,0.22);
}

.primary:hover{
  transform:translateY(-2px);

  box-shadow:
  0 20px 40px rgba(37,99,235,0.28);
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

  .contact-container{
    grid-template-columns:1fr;
  }

  .contact-hero h2{
    font-size:38px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media(max-width:480px){

  .contact{
    padding-bottom:40px;
  }

  .contact-hero{
    padding:70px 16px 34px;
  }

  .contact-hero h2{
    font-size:30px;
  }

  .contact-hero p{
    font-size:14px;
  }

  .contact-container{
    padding:0 12px;
  }

  .card{
    padding:24px;

    border-radius:24px;
  }

  .card h3{
    font-size:24px;
  }

  .contact-form input,
  .contact-form textarea,
  .primary{
    font-size:14px;

    padding:14px 16px;
  }
}

</style>