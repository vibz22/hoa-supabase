<!-- <script setup>
import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const user = ref(null)
const role = ref("")
const loading = ref(true)

onMounted(async () => {
  // 🔐 GET USER
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    navigateTo("/login")
    return
  }

  user.value = data.user

  // 🔍 FETCH USER DATA (same as firestore getDoc)
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single()

  role.value = userData?.role || "homeowner"

  loading.value = false
})

// 🚪 LOGOUT
const logout = async () => {
  await supabase.auth.signOut()
  navigateTo("/login")
}
</script>

<template>
  <div class="wrapper">
    <div class="login-box">

      <h1>Profile</h1>

      <div v-if="loading">
        <p>Loading profile...</p>
      </div>

      <div v-else>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Role:</strong> {{ role }}</p>

        <button @click="logout">Logout</button>
      </div>

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

.login-box {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  padding: 40px;
  width: 360px;
  border-radius: 20px;
  color: white;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 12px;
  width: 100%;
  background: #ef4444;
  border-radius: 10px;
  color: white;
}
</style> -->

<script setup>
// definePageMeta({
//   middleware: "auth"
// })

import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const loading = ref(true)
const saving = ref(false)

const form = ref({
  name: "",
  phone: "",
  email: ""
})

const error = ref("")
const success = ref("")

// 🔥 Load user data
onMounted(async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  // 🔍 fetch from users table (like Firestore getDoc)
  const { data, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (fetchError) {
    console.error(fetchError)
  }

  form.value = {
    name: data?.name || "",
    phone: data?.phone || "",
    email: user.email || ""
  }

  loading.value = false
})

// 🔥 Save profile
const saveProfile = async () => {
  error.value = ""
  success.value = ""
  saving.value = true

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Not logged in")

    // 🔥 Update users table (like Firestore updateDoc)
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: form.value.name,
        phone: form.value.phone
      })
      .eq("id", user.id)

    if (updateError) throw updateError

    // 🔥 Update email (Supabase equivalent)
    if (form.value.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: form.value.email
      })

      if (emailError) throw emailError
    }

    success.value = "Profile updated successfully"

  } catch (err) {
    error.value = err.message || "Update failed"
  }

  saving.value = false
}
</script>

<template>
  <div class="profile">
    <h1>My Profile</h1>

    <div v-if="loading">Loading...</div>

    <div v-else class="card">
      <input v-model="form.name" placeholder="Full Name" />
      <input v-model="form.phone" placeholder="Phone Number" />
      <input v-model="form.email" placeholder="Email" />

      <button @click="saveProfile" :disabled="saving">
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>

      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

/* PAGE */

.profile {

  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  max-width: 620px;
  margin: auto;
}

/* TITLE */

.profile h1 {
  font-size: 42px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 28px;

  animation: fadeUp 0.5s ease;
}

/* CARD */

.card {
  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  padding: 34px;

  border-radius: 28px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.06);

  display: flex;
  flex-direction: column;

  gap: 18px;

  animation: fadeUp 0.7s ease;
}

/* INPUTS */

input {
  width: 100%;

  height: 56px;

  padding: 0 18px;

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

/* FOCUS */

input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* PLACEHOLDER */

input::placeholder {
  color: #94A3B8;
}

/* BUTTON */

button {
  width: 100%;

  height: 56px;

  margin-top: 10px;

  border: none;

  border-radius: 16px;

  background: #2563EB;

  color: white;

  font-size: 16px;
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
  opacity: 0.7;
  cursor: not-allowed;
}

/* SUCCESS */

.success {
  padding: 14px 16px;

  border-radius: 14px;

  background: #DCFCE7;

  color: #166534;

  font-size: 14px;
  font-weight: 600;

  animation: fadeUp 0.4s ease;
}

/* ERROR */

.error {
  padding: 14px 16px;

  border-radius: 14px;

  background: #FEE2E2;

  color: #991B1B;

  font-size: 14px;
  font-weight: 600;

  animation: fadeUp 0.4s ease;
}

/* ANIMATION */

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

/* TABLET */

@media (max-width: 768px) {

  .profile {
    padding: 30px 16px;
  }

  .profile h1 {
    font-size: 34px;
  }

  .card {
    padding: 28px;
  }
}

/* MOBILE */

@media (max-width: 480px) {

  .profile {
    padding: 20px 14px;
  }

  .profile h1 {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .card {
    padding: 22px;

    border-radius: 22px;
  }

  input,
  button {
    height: 50px;
    font-size: 14px;
  }
}
</style>