<!-- <script setup>
const supabase = useNuxtApp().$supabase

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const validate = () => {
  if (!email.value.includes('@')) {
    return 'Enter a valid email'
  }
  if (password.value.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
}

const signUp = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  const validationError = validate()
  if (validationError) {
    errorMsg.value = validationError
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    successMsg.value = 'Account created. Check your email.'

    // OPTIONAL: redirect after signup
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)

  } catch (err) {
    errorMsg.value = err.message || 'Something went wrong'
  }

  loading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

      <h1 class="text-2xl font-bold text-center mb-6">
        Create Account
      </h1>

      <form @submit.prevent="signUp" class="space-y-4">

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Sign Up' }}
        </button>

      </form>

      <p v-if="errorMsg" class="mt-4 text-center text-red-500 text-sm">
        {{ errorMsg }}
      </p>

      <p v-if="successMsg" class="mt-4 text-center text-green-600 text-sm">
        {{ successMsg }}
      </p>

    </div>
  </div>
</template> -->


<script setup>
definePageMeta({
  layout: "auth"
})
import { ref } from "vue"

const supabase = useNuxtApp().$supabase

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

const signup = async () => {
  error.value = ""
  loading.value = true

  try {
    // 🔐 SIGNUP (same as Firebase createUser)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (signUpError) throw signUpError

    const user = data.user
    const uid = user.id   // 👈 Firebase uid equivalent

    // 👤 INSERT USER (same as setDoc)
    await supabase.from("users").insert({
      id: uid,
      email: email.value,
      role: "homeowner"
    })

    // 🚀 REDIRECT
    navigateTo("/dashboard")

  } catch (e) {
    console.log(e)
    error.value = e.message || "Signup failed"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="login-box">
      <h1>Create Account</h1>
      <p class="subtitle">Join your HOA community</p>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="signup" :disabled="loading">
        {{ loading ? "Creating..." : "Sign Up" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="switch">
        Already have an account?
        <span @click="navigateTo('/login')">Log In</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

/* 🔥 Glass card */
.login-box {
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

/* Subtitle */
.subtitle {
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
  font-size: 14px;
}

/* Inputs */
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

/* Focus effect */
input:focus {
  border: 1px solid rgba(99,102,241,0.6);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
}

input::placeholder {
  color: rgba(255,255,255,0.4);
}

/* Button */
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
  box-sizing: border-box;

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

/* Error */
.error {
  color: #f87171;
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
}

/* Switch link */
.switch {
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
  color: rgba(255,255,255,0.7);
}

.switch span {
  color: #818cf8;
  cursor: pointer;
  font-weight: 500;
}

.switch span:hover {
  text-decoration: underline;
}

/* 📱 Mobile */
@media (max-width: 480px) {
  .login-box {
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

/* 📲 Very small devices */
@media (max-width: 360px) {
  .login-box {
    padding: 22px;
  }

  h1 {
    font-size: 20px;
  }
}
</style>