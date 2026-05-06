<script setup>
import { ref, watchEffect } from "vue"
import { useAuth } from "~/composables/useAuth"

const { role } = useAuth()

const email = ref("")
const name = ref("")
const userRole = ref("homeowner")
const loading = ref(false)
const message = ref("")
const supabase = useNuxtApp().$supabase

// 🔐 protect page
watchEffect(() => {
  if (role.value === undefined) return
  if (role.value !== "admin") {
    navigateTo("/")
  }
})

// 🚀 invite
const inviteUser = async () => {
  if (!email.value || !name.value) return

  loading.value = true
  message.value = ""

  // 🔥 get logged-in session
  const session = await supabase.auth.getSession()

  const res = await $fetch("/api/invite-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.data.session.access_token}`
    },
    body: {
      email: email.value,
      name: name.value,
      role: userRole.value
    }
  })

 if (res.error === "User already registered") {
  message.value = "⚠️ User already registered"
} else if (res.error) {
  message.value = "❌ " + res.error
} else {
  message.value = "✅ Invitation sent!"
  email.value = ""
  name.value = ""
}

  loading.value = false
}
</script>

<template>
  <div class="wrapper">
  <div class="invite-box">
    <h1>Invite User</h1>
    <p class="subtitle">Send an invitation to a homeowner</p>

    <input v-model="name" placeholder="Full Name" />
    <input v-model="email" placeholder="Email" />

    <div class="select-wrapper">
  <select v-model="userRole">
    <option value="homeowner">Homeowner</option>
    <option value="admin">Admin</option>
  </select>
</div>

    <button @click="inviteUser" :disabled="loading">
      {{ loading ? "Sending..." : "Send Invite" }}
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

  background: #F8FAFC;
}

/* ========================= */
/* CARD */
/* ========================= */

.invite-box {
  width: 100%;
  max-width: 460px;

  padding: 40px;

  border-radius: 30px;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.06);

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
  text-align: center;

  color: #64748B;

  margin-bottom: 28px;

  font-size: 15px;
  line-height: 1.6;
}

/* ========================= */
/* INPUTS */
/* ========================= */

input,
select {
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

input:focus,
select:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* ========================= */
/* SELECT */
/* ========================= */

.select-wrapper {
  position: relative;
}

/* REMOVE DEFAULT */

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  cursor: pointer;

  padding-right: 54px;
}

/* OPTIONS */

select option {
  color: #0F172A;
  background: white;
}

/* CUSTOM ARROW */

.select-wrapper::after {
  content: "⌄";

  position: absolute;

  right: 18px;
  top: 30%;

  transform: translateY(-55%);

  color: #64748B;

  font-size: 22px;
  font-weight: 700;

  pointer-events: none;

  line-height: 1;
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
  margin-top: 18px;

  padding: 14px 16px;

  border-radius: 16px;

  text-align: center;

  font-size: 14px;
  font-weight: 600;

  line-height: 1.6;

  background: #EFF6FF;

  color: #1D4ED8;
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

  .invite-box {
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

  .invite-box {
    padding: 24px;

    border-radius: 22px;
  }

  h1 {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }

  input,
  select,
  button {
    padding: 14px 16px;

    font-size: 14px;
  }

  .message {
    font-size: 13px;
  }
}

</style>