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
/* 🔥 MATCH LOGIN PAGE */
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

/* 🔥 GLASS CARD */
.box {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  padding: 40px;
  width: 100%;
  max-width: 360px;
  border-radius: 20px;
  color: white;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.4),
    inset 0 0 0 1px rgba(255,255,255,0.05);
  box-sizing: border-box;
}

/* 🔥 TITLE */
h1 {
  text-align: center;
  margin-bottom: 6px;
}

/* 🔥 SUBTITLE */
.subtitle {
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* 🔥 INPUTS */
input {
  width: 100%;
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
  color: white;
  font-size: 15px;
  outline: none;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(255,255,255,0.4);
}

input:focus {
  border: 1px solid rgba(99,102,241,0.6);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
}

/* 🔥 BUTTON */
button {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border-radius: 12px;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  background: linear-gradient(135deg, #6366f1, #818cf8);
  box-shadow: 
    0 6px 20px rgba(99,102,241,0.35),
    inset 0 1px 0 rgba(255,255,255,0.2);

  transition: all 0.25s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 10px 25px rgba(99,102,241,0.45),
    inset 0 1px 0 rgba(255,255,255,0.25);
}

button:active {
  transform: scale(0.98);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 🔥 MESSAGE */
.message {
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
}

/* 📱 MOBILE */
@media (max-width: 480px) {
  .box {
    padding: 28px;
    border-radius: 16px;
  }

  h1 {
    font-size: 22px;
  }

  .subtitle {
    font-size: 13px;
  }

  input,
  button {
    font-size: 14px;
    padding: 10px;
  }
}
</style>