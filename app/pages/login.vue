<script setup>
import { ref } from "vue"

const supabase = useNuxtApp().$supabase

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

const login = async () => {
  error.value = ""
  loading.value = true

  try {
    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })

    if (loginError) throw loginError

    const user = data.user
    const uid = user.id

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .single()

    if (!existingUser) {
      await supabase.from("users").insert({
        id: uid,
        email: email.value,
        role: "homeowner"
      })
    }

    navigateTo("/dashboard")

  } catch (e) {
    console.log(e)
    error.value = "Invalid email or password"
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: "auth"
})
</script>

<template>
  <div class="wrapper">

    <!-- LEFT SIDE -->
    <div class="left">

      <span class="badge">
        Smart HOA Platform
      </span>

      <h1>
        Manage Your Community Smarter
      </h1>

      <p>
        Handle announcements, maintenance,
        documents, and communication —
        all from one modern HOA platform.
      </p>

      <div class="features">

        <div class="feature">
          <span>📢</span>
          <p>Community Announcements</p>
        </div>

        <div class="feature">
          <span>🛠️</span>
          <p>Maintenance Tracking</p>
        </div>

        <div class="feature">
          <span>📄</span>
          <p>Digital Documents</p>
        </div>

      </div>

    </div>

    <!-- RIGHT SIDE -->
    <div class="right">

      <div class="login-box">

        <h2>Welcome Back</h2>

        <p class="subtitle">
          Login to your HOA account
        </p>

        <input
          v-model="email"
          type="email"
          placeholder="Email Address"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
        />

        <button
          @click="login"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>

      </div>

    </div>

  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

.wrapper {
  min-height: 100vh;

  display: grid;
  grid-template-columns: 1.1fr 0.9fr;

  align-items: center;

  padding: 40px 80px;
  gap: 60px;

  background:
    linear-gradient(
      rgba(248,250,252,0.92),
      rgba(248,250,252,0.95)
    ),
    url("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600");

  background-size: cover;
  background-position: center;
}

/* LEFT */

.left {
  max-width: 650px;
}

.badge {
  display: inline-block;

  background: #DBEAFE;
  color: #2563EB;

  padding: 8px 16px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 600;

  margin-bottom: 28px;
}

.left h1 {
  font-size: 68px;
  line-height: 1.05;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 24px;
}

.left > p {
  font-size: 22px;
  line-height: 1.7;

  color: #475569;

  margin-bottom: 40px;
}

/* FEATURES */

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature {
  width: 100%;
  max-width: 420px;
  min-height: 90px;

  display: flex;
  align-items: center;
  gap: 16px;

  background: rgba(255,255,255,0.88);

  padding: 20px 24px;

  border-radius: 22px;

  border: 1px solid #E2E8F0;

  backdrop-filter: blur(14px);

  box-shadow:
    0 4px 20px rgba(15,23,42,0.05);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;

  cursor: pointer;

  animation: floatUp 0.7s ease forwards;
}

/* Hover animation */
.feature:hover {
  transform: translateY(-6px) scale(1.02);

  background: white;

  box-shadow:
    0 15px 35px rgba(37,99,235,0.12);
}

/* Icon */
.feature span {
  font-size: 28px;

  transition: transform 0.3s ease;
}

/* Icon rotate animation */
.feature:hover span {
  transform: rotate(-8deg) scale(1.1);
}

/* Text */
.feature p {
  color: #0F172A;
  font-weight: 700;
  font-size: 17px;
  margin: 0;
}

/* Entry animation */
@keyframes floatUp {

  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.feature span {
  font-size: 24px;
}

.feature p {
  color: #0F172A;
  font-weight: 600;
  font-size: 16px;
}

/* RIGHT */

.right {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* LOGIN BOX */

.login-box {
  width: 100%;
  max-width: 430px;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  padding: 42px;

  border-radius: 30px;

  border: 1px solid rgba(255,255,255,0.7);

  box-shadow:
    0 10px 40px rgba(15,23,42,0.08);
}

.login-box h2 {
  font-size: 42px;
  line-height: 1.1;

  color: #0F172A;

  margin-bottom: 10px;
}

.subtitle {
  color: #64748B;

  margin-bottom: 30px;

  font-size: 16px;
}

/* INPUTS */

input {
  width: 100%;

  margin-bottom: 16px;

  padding: 16px;

  border-radius: 16px;

  border: 1px solid #CBD5E1;

  background: white;

  font-size: 15px;

  color: #0F172A;

  outline: none;

  transition: all 0.25s ease;
}

input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);
}

input::placeholder {
  color: #94A3B8;
}

/* BUTTON */

button {
  width: 100%;

  padding: 16px;

  border: none;

  border-radius: 16px;

  background: #2563EB;

  color: white;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;

  box-shadow:
    0 10px 25px rgba(37,99,235,0.18);
}

button:hover {
  background: #1D4ED8;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ERROR */

.error {
  margin-top: 14px;

  color: #DC2626;

  text-align: center;

  font-size: 14px;
}

/* ========================= */
/* LAPTOP */
/* ========================= */

@media (max-width: 1200px) {

  .wrapper {
    padding: 40px;
    gap: 40px;
  }

  .left h1 {
    font-size: 54px;
  }

  .left > p {
    font-size: 18px;
  }
}

/* ========================= */
/* TABLET */
/* ========================= */

@media (max-width: 992px) {

  .wrapper {
    grid-template-columns: 1fr;

    padding: 40px 24px;

    gap: 40px;
  }

  .left {
    max-width: 100%;
    text-align: center;
  }

  .features {
    align-items: center;
  }

  .feature {
    width: 100%;
    max-width: 420px;
    justify-content: center;
  }

  .left h1 {
    font-size: 46px;
  }

  .left > p {
    margin: auto;
    margin-bottom: 36px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 600px) {

  .wrapper {
    padding: 20px 16px;
  }

  .left h1 {
    font-size: 36px;
  }

  .left > p {
    font-size: 16px;
  }

  .login-box {
    padding: 28px;
    border-radius: 24px;
  }

  .login-box h2 {
    font-size: 30px;
  }

  input,
  button {
    padding: 14px;
    font-size: 14px;
  }

  .feature {
    padding: 14px 16px;
  }

  .feature p {
    font-size: 14px;
  }
}

/* ========================= */
/* SMALL MOBILE */
/* ========================= */

@media (max-width: 380px) {

  .left h1 {
    font-size: 30px;
  }

  .login-box {
    padding: 22px;
  }
}

</style>