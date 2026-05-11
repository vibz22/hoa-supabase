<script setup>
import { ref, onMounted, computed } from "vue"

const supabase = useNuxtApp().$supabase

const documents = ref([])
const users = ref([])
const loading = ref(false)
const message = ref("")

// 🔍 filters
const search = ref("")
const selectedUser = ref("")

// 🔥 user search dropdown
const userSearch = ref("")
const showUserDropdown = ref(false)

// 🔥 fetch documents + users
const fetchDocuments = async () => {
  loading.value = true
  message.value = ""

  try {
    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .order("id", { ascending: false })

    if (!docs) return

    const { data: allUsers } = await supabase
      .from("users")
      .select("id, name, email")

    users.value = allUsers || []

    const enriched = await Promise.all(
      docs.map(async (doc) => {
        const { data: access } = await supabase
          .from("document_access")
          .select("user_id")
          .eq("document_id", doc.id)

        const userIds = access?.map(a => a.user_id) || []

        let docUsers = []

        if (userIds.length > 0) {
          const { data: userData } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", userIds)

          docUsers = userData || []
        }

        return {
          ...doc,
          users: docUsers
        }
      })
    )

    documents.value = enriched

  } catch (err) {
    console.error(err)
    message.value = "❌ Failed to load documents"
  }

  loading.value = false
}

// 🔥 filter users for dropdown
const filteredUsers = computed(() => {
  return users.value.filter(u =>
    (u.name || u.email)
      .toLowerCase()
      .includes(userSearch.value.toLowerCase())
  )
})

// 🔥 filter documents
const filteredDocs = computed(() => {
  return documents.value.filter(doc => {

    const matchesSearch =
      doc.title.toLowerCase().includes(search.value.toLowerCase())

    const matchesUser =
      !selectedUser.value ||
      doc.users.some(u => u.id === selectedUser.value)

    return matchesSearch && matchesUser
  })
})

// 🔥 delete doc
const deleteDoc = async (id) => {
  if (!confirm("Delete this document?")) return

  await $fetch("/api/delete-document", {
    method: "POST",
    body: { id }
  })

  fetchDocuments()
}

// 🔥 unassign user
const removeUser = async (docId, userId) => {
  await $fetch("/api/unassign-document", {
    method: "POST",
    body: {
      document_id: docId,
      user_id: userId
    }
  })

  fetchDocuments()
}

// 🔥 close dropdown on outside click
onMounted(() => {
  fetchDocuments()

  document.addEventListener("click", () => {
    showUserDropdown.value = false
  })
})
</script>

<template>
  <div class="wrapper">
    <div class="container">

      <h1>📂 Document Management</h1>

      <!-- 🔥 FILTERS -->
      <div class="filters">

        <!-- 🔍 SEARCH DOC -->
        <input
          v-model="search"
          placeholder="Search documents..."
        />

        <!-- 👤 USER SEARCH DROPDOWN -->
        <div class="user-filter" @click.stop>

          <input
            v-model="userSearch"
            placeholder="Search user..."
            @focus="showUserDropdown = true"
          />

          <div v-if="showUserDropdown" class="dropdown">

            <!-- ALL USERS -->
            <div
              class="option"
              @click="
                selectedUser = '';
                userSearch = '';
                showUserDropdown = false
              "
            >
              All Users
            </div>

            <!-- USERS -->
            <div
              v-for="u in filteredUsers"
              :key="u.id"
              class="option"
              @click="
                selectedUser = u.id;
                userSearch = u.name || u.email;
                showUserDropdown = false
              "
            >
              {{ u.name || u.email }}
            </div>

            <div v-if="filteredUsers.length === 0" class="no-result">
              No users found
            </div>

          </div>
        </div>

      </div>

      <!-- STATES -->
      <div v-if="loading" class="empty">Loading...</div>
      <div v-else-if="message" class="empty">{{ message }}</div>
      <div v-else-if="filteredDocs.length === 0" class="empty">
        No documents found
      </div>

      <!-- LIST -->
      <div v-else class="list">
        <div v-for="doc in filteredDocs" :key="doc.id" class="card">

          <div class="top">
            <div class="title">
              {{ doc.title }}
            </div>

            <button class="delete" @click="deleteDoc(doc.id)">
              Delete
            </button>
          </div>

          <div class="users">
            <span v-if="doc.users.length === 0" class="no-users">
              No users assigned
            </span>

            <div v-else class="chips">
              <div v-for="u in doc.users" :key="u.id" class="chip">
                {{ u.name || u.email }}

                <span class="remove" @click="removeUser(doc.id, u.id)">
                  ✕
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

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

  padding: 30px 20px;

  background: #F8FAFC;

  display: flex;
  justify-content: center;
}

/* ========================= */
/* CONTAINER */
/* ========================= */

.container {
  width: 100%;
  max-width: 1000px;

  animation: fadeUp 0.5s ease;
}

/* ========================= */
/* TITLE */
/* ========================= */

h1 {
  font-size: 38px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 28px;
}

/* ========================= */
/* FILTERS */
/* ========================= */

.filters {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
}

/* INPUTS */

.filters input {
  width: 100%;

  padding: 16px 18px;

  border-radius: 18px;

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

.filters input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.12);

  transform: translateY(-1px);
}

/* PLACEHOLDER */

.filters input::placeholder {
  color: #94A3B8;
}

/* ========================= */
/* USER FILTER */
/* ========================= */

.user-filter {
  position: relative;
  width: 100%;
}

.user-filter input {
  width: 100%;
}
/* ========================= */
/* DROPDOWN */
/* ========================= */

.dropdown {
  position: absolute;

  top: 110%;
  left: 0;
  right: 0;

  max-height: 260px;

  overflow-y: auto;

  background: white;

  border-radius: 20px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 18px 40px rgba(15,23,42,0.08);

  z-index: 20;

  animation: fadeUp 0.2s ease;
}

/* OPTION */

.option {
  padding: 14px 18px;

  cursor: pointer;

  color: #334155;

  font-weight: 600;

  transition: background 0.25s ease;
}

/* HOVER */

.option:hover {
  background: #EFF6FF;

  color: #2563EB;
}

/* NO RESULT */

.no-result {
  padding: 14px 18px;

  color: #94A3B8;
}

/* ========================= */
/* STATES */
/* ========================= */

.empty {
  text-align: center;

  padding: 60px 20px;

  border-radius: 24px;

  background: rgba(255,255,255,0.82);

  border: 1px solid #E2E8F0;

  color: #64748B;

  font-size: 16px;

  backdrop-filter: blur(18px);
}

/* ========================= */
/* LIST */
/* ========================= */

.list {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

/* ========================= */
/* CARD */
/* ========================= */

.card {
  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  padding: 24px;

  border-radius: 28px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 30px rgba(15,23,42,0.05);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  animation: fadeUp 0.6s ease;
}

/* HOVER */

.card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 18px 40px rgba(37,99,235,0.10);
}

/* ========================= */
/* TOP */
/* ========================= */

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;
}

/* TITLE */

.title {
  font-size: 18px;
  font-weight: 800;

  color: #0F172A;
}

/* ========================= */
/* DELETE */
/* ========================= */

.delete {
  border: none;

  padding: 10px 16px;

  border-radius: 14px;

  background: #FEE2E2;

  color: #B91C1C;

  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;
}

/* HOVER */

.delete:hover {
  background: #FECACA;

  transform: translateY(-1px);
}

/* ========================= */
/* USERS */
/* ========================= */

.users {
  margin-top: 18px;
}

/* NO USERS */

.no-users {
  color: #94A3B8;

  font-size: 14px;
}

/* ========================= */
/* CHIPS */
/* ========================= */

.chips {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;
}

/* CHIP */

.chip {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;

  border-radius: 999px;

  background: #DBEAFE;

  color: #1D4ED8;

  font-size: 13px;
  font-weight: 700;

  transition: all 0.25s ease;
}

/* HOVER */

.chip:hover {
  transform: translateY(-1px);
}

/* REMOVE */

.remove {
  cursor: pointer;

  font-size: 12px;

  opacity: 0.7;

  transition: opacity 0.2s ease;
}

.remove:hover {
  opacity: 1;
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

  .wrapper {
    padding: 24px 16px;
  }

  h1 {
    font-size: 30px;
  }

  .card {
    padding: 20px;
    border-radius: 22px;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */

@media (max-width: 480px) {

  .wrapper {
    padding: 18px 12px;
  }

  h1 {
    font-size: 26px;
  }

  .card {
    padding: 18px;
  }

  .top {
    flex-direction: column;
    align-items: stretch;
  }

  .delete {
    width: 100%;
  }

  .filters input {
    padding: 14px 16px;
    font-size: 14px;
  }

  .chip {
    width: 100%;
    justify-content: space-between;
  }
}

</style>