<script setup>
definePageMeta({
  layout: "auth"
})
import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const message = ref("")
const invalidLink = ref(false)

// onMounted(async () => {
//   const { data } = await supabase.auth.getSession()

//   if (!data.session) {
//     invalidLink.value = true
//     message.value = "⚠️ This link is invalid or has already been used. Please request a new invite."
//   }
// })
onMounted(async () => {

  // allow Supabase time to restore invite session
  await new Promise(resolve =>
    setTimeout(resolve, 1200)
  )

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  console.log("SESSION:", session)
  console.log("ERROR:", error)

  if (error || !session) {

    invalidLink.value = true

    message.value =
      "⚠️ This link is invalid or has already been used. Please request a new invite."
  }
})

const setPassword = async () => {
  if (!password.value) return

  loading.value = true
  message.value = ""

  const { error } = await supabase.auth.updateUser({
    password: password.value
  })

  if (error) {
    message.value = "❌ " + error.message
  } else {
    message.value = "✅ Password set! Redirecting..."
    setTimeout(() => navigateTo("/dashboard"), 1500)
  }

  loading.value = false
}
</script>

<!-- <template>
  <div class="wrapper">
    <div class="box">
      <h1>Set Your Password</h1>

      <input 
        v-model="password" 
        type="password" 
        placeholder="Enter new password" 
      />

      <button @click="setPassword" :disabled="loading">
        {{ loading ? "Saving..." : "Set Password" }}
      </button>

      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

.box {
  background: rgba(255,255,255,0.06);
  padding: 30px;
  border-radius: 16px;
  color: white;
  width: 100%;
  max-width: 360px;
}

input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 10px;
}

button {
  width: 100%;
  padding: 12px;
  background: #6366f1;
  border: none;
  border-radius: 10px;
  color: white;
}
</style> -->

<template>
  <div class="wrapper">
    <div class="box">
      <h1>Set Your Password</h1>
      <p class="subtitle">Secure your account to continue</p>

      <input 
        v-model="password" 
        type="password" 
        placeholder="Enter new password" 
      />

      <input 
        v-model="confirmPassword" 
        type="password" 
        placeholder="Confirm password" 
      />

      <!-- <button @click="setPassword" :disabled="loading">
        {{ loading ? "Saving..." : "Set Password" }}
      </button> -->
      <button 
  @click="setPassword" 
  :disabled="loading || invalidLink"
>
  {{ loading ? "Saving..." : "Set Password" }}
</button>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

/* ========================= */
/* PAGE */
/* ========================= */

.wrapper {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background:
    linear-gradient(
      rgba(248,250,252,0.92),
      rgba(248,250,252,0.96)
    ),
    url("https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600");

  background-size: cover;
  background-position: center;
}

/* ========================= */
/* BOX */
/* ========================= */

.box {
  width: 100%;
  max-width: 420px;

  padding: 40px;

  border-radius: 30px;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.7);

  box-shadow:
    0 10px 40px rgba(15,23,42,0.08);

  animation: fadeUp 0.5s ease;
}

/* ========================= */
/* TITLE */
/* ========================= */

h1 {
  font-size: 34px;
  font-weight: 800;

  color: #0F172A;

  text-align: center;

  margin-bottom: 10px;
}

/* SUBTITLE */

.subtitle {
  color: #64748B;

  text-align: center;

  margin-bottom: 28px;

  font-size: 15px;
  line-height: 1.6;
}

/* ========================= */
/* INPUTS */
/* ========================= */

input {
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

/* PLACEHOLDER */

input::placeholder {
  color: #94A3B8;
}

/* FOCUS */

input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* ========================= */
/* BUTTON */
/* ========================= */

button {
  width: 100%;

  padding: 16px;

  margin-top: 8px;

  border: none;

  border-radius: 18px;

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
    0 18px 40px rgba(37,99,235,0.22);
}

/* ACTIVE */

button:active {
  transform: scale(0.98);
}

/* DISABLED */

button:disabled {
  opacity: 0.65;

  cursor: not-allowed;

  transform: none;
}

/* ========================= */
/* MESSAGE */
/* ========================= */

.message {
  margin-top: 16px;

  padding: 14px 16px;

  border-radius: 16px;

  background: #EFF6FF;

  color: #1D4ED8;

  text-align: center;

  font-size: 14px;
  font-weight: 600;

  line-height: 1.6;
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

  .box {
    padding: 32px;

    border-radius: 24px;
  }

  h1 {
    font-size: 30px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 480px) {

  .wrapper {
    padding: 16px;
  }

  .box {
    padding: 26px;

    border-radius: 22px;
  }

  h1 {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }

  input,
  button {
    padding: 14px 16px;

    font-size: 14px;
  }

  .message {
    font-size: 13px;
  }
}

</style>