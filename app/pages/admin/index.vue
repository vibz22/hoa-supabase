<script setup>
import { ref, onMounted } from "vue"
import ConfirmModal from "~/components/ConfirmModal.vue"
import { useToast } from "~/composables/useToast"
import { useAuth } from "~/composables/useAuth"

const supabase = useNuxtApp().$supabase
const { success } = useToast()
const { user, role, fetchUser } = useAuth()

const users = ref([])
const loading = ref(true)

const showModal = ref(false)
const selectedUser = ref(null)

// ✅ FETCH USERS
const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")

  if (error) {
    console.error("FETCH ERROR:", error)
    alert("Failed to load users")
    return
  }

  users.value = data
  loading.value = false
}

// ✅ TOGGLE ROLE
const toggleRole = async (u) => {
  if (u.id === user.value?.id) {
    alert("You cannot change your own role")
    return
  }

  const newRole = u.role === "admin" ? "homeowner" : "admin"

  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", u.id)

  if (error) {
    console.error("ROLE ERROR:", error)
    alert("Failed to update role")
    return
  }

  u.role = newRole
  success("Role updated")
}

// ✅ OPEN MODAL
const confirmDelete = (u) => {
  selectedUser.value = u
  showModal.value = true
}

// ✅ DELETE USER
const deleteUser = async () => {
  const u = selectedUser.value
  showModal.value = false

  if (u.id === user.value?.id) {
    alert("You cannot delete yourself")
    return
  }

  // 🔐 Get session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const token = session?.access_token

  if (!token) {
    alert("No session found. Please login again.")
    return
  }

  // 🔥 Call backend
  let res
  try {
    res = await $fetch("/api/deleteUser", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        uid: u.id
      }
    })
  } catch (err) {
    console.error("API ERROR:", err)
    alert("Delete request failed")
    return
  }

  if (!res || res.error) {
    console.error("DELETE FAILED:", res)
    alert("Delete failed")
    return
  }

  // ✅ Update UI
  users.value = users.value.filter(x => x.id !== u.id)

  success("User deleted")
}

// 🚀 INIT (ADMIN PROTECTION HERE)
onMounted(async () => {
  await fetchUser()

  // ❌ not logged in
  if (!user.value) {
    return navigateTo("/login")
  }

  // ❌ NOT ADMIN → BLOCK ACCESS
  if (role.value !== "admin") {
    return navigateTo("/dashboard")
  }

  // ✅ ONLY ADMIN CAN LOAD DATA
  await fetchUsers()
})
</script>

<template>
  <div>
    <h1>Admin Panel</h1>

    <div v-if="loading">Loading...</div>

    <table v-else>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.email }}</td>

          <td>
            <span :class="u.role === 'admin' ? 'admin' : 'user'">
              {{ u.role }}
            </span>
          </td>

          <td>
            <!-- 🔒 Disable self actions -->
            <!-- <button
              @click="toggleRole(u)"
              :disabled="u.id === user.value?.id"
              :title="u.id === user.value?.id ? 'Cannot modify yourself' : ''"
            >
              Toggle Role
            </button>

            <button
              class="delete"
              @click="confirmDelete(u)"
              :disabled="u.id === user.value?.id"
              :title="u.id === user.value?.id ? 'Cannot delete yourself' : ''"
            >
              Delete
            </button> -->

            <button
  @click="toggleRole(u)"
  :disabled="u.id === user?.id"
>
  Toggle Role
</button>

<button
  class="delete"
  @click="confirmDelete(u)"
  :disabled="u.id === user?.id"
>
  Delete
</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmModal
      :show="showModal"
      message="Delete this user?"
      @confirm="deleteUser"
      @cancel="showModal = false"
    />
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

/* ========================= */
/* PAGE TITLE */
/* ========================= */

h1 {
  font-size: 38px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 28px;

  animation: fadeUp 0.5s ease;
}

/* ========================= */
/* TABLE */
/* ========================= */

table {
  width: 100%;

  border-collapse: collapse;

  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid #E2E8F0;

  border-radius: 28px;

  overflow: hidden;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.05);

  animation: fadeUp 0.7s ease;
}

/* ========================= */
/* HEADER */
/* ========================= */

thead {
  background: #F8FAFC;
}

th {
  text-align: left;

  padding: 18px 20px;

  font-size: 14px;
  font-weight: 800;

  color: #64748B;

  border-bottom: 1px solid #E2E8F0;
}

/* ========================= */
/* CELLS */
/* ========================= */

td {
  padding: 18px 20px;

  border-bottom: 1px solid #E2E8F0;

  color: #0F172A;

  font-size: 14px;

  transition: background 0.25s ease;
}

/* ROW HOVER */

tbody tr:hover {
  background: #FAFBFC;
}

/* ========================= */
/* BUTTONS */
/* ========================= */

button {
  border: none;

  padding: 10px 16px;

  border-radius: 14px;

  background: #2563EB;

  color: white;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  margin-right: 8px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  box-shadow:
    0 8px 20px rgba(37,99,235,0.16);
}

/* HOVER */

button:hover {
  background: #1D4ED8;

  transform: translateY(-2px);
}

/* DELETE */

.delete {
  background: #FEE2E2;

  color: #B91C1C;

  box-shadow: none;
}

.delete:hover {
  background: #FECACA;
}

/* DISABLED */

button:disabled {
  opacity: 0.5;

  cursor: not-allowed;

  transform: none;
}

/* ========================= */
/* ROLE TAGS */
/* ========================= */

.admin,
.user {
  display: inline-flex;
  align-items: center;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
}

/* ADMIN */

.admin {
  background: #DBEAFE;

  color: #1D4ED8;
}

/* USER */

.user {
  background: #F1F5F9;

  color: #475569;
}

/* ========================= */
/* LOADING */
/* ========================= */

div[v-if="loading"] {
  color: #64748B;
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

  h1 {
    font-size: 30px;
  }

  table {
    border-radius: 22px;
  }

  th,
  td {
    padding: 14px 16px;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 640px) {

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  table {
    background: transparent;

    border: none;

    box-shadow: none;
  }

  thead {
    display: none;
  }

  tr {
    background: rgba(255,255,255,0.82);

    backdrop-filter: blur(18px);

    border: 1px solid #E2E8F0;

    border-radius: 24px;

    margin-bottom: 18px;

    padding: 16px;

    box-shadow:
      0 10px 30px rgba(15,23,42,0.05);
  }

  td {
    border: none;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 0;

    gap: 16px;
  }

  td::before {
    content: attr(data-label);

    font-weight: 700;

    color: #64748B;

    font-size: 13px;
  }

  /* ACTION BUTTONS */

  td:last-child {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;

    margin-right: 0;
  }
}

</style>