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

// 🔥 user dropdown
const userSearch = ref("")
const showUserDropdown = ref(false)

// 🔥 fetch docs
const fetchDocuments = async () => {

  loading.value = true
  message.value = ""

  try {

    // 📄 documents
    const {
      data: docs,
      error: docsError
    } = await supabase
      .from("documents")
      .select("*")
      .order("id", { ascending: false })

    console.log("DOCS:", docs)
    console.log("DOCS ERROR:", docsError)

    if (docsError) {
      throw docsError
    }

    if (!docs) {
      documents.value = []
      return
    }

    // 👥 users
    const {
      data: allUsers,
      error: usersError
    } = await supabase
      .from("users")
      .select("id, name, email")

    console.log("USERS:", allUsers)
    console.log("USERS ERROR:", usersError)

    if (usersError) {
      throw usersError
    }

    users.value = allUsers || []

    // 🔥 enrich documents
    const enriched = await Promise.all(

      docs.map(async (doc) => {

        const {
          data: access,
          error: accessError
        } = await supabase
          .from("document_access")
          .select("user_id")
          .eq("document_id", doc.id)

        if (accessError) {
          console.log(accessError)
        }

        const userIds =
          access?.map(a => a.user_id) || []

        let docUsers = []

        if (userIds.length > 0) {

          const {
            data: userData,
            error: userError
          } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", userIds)

          if (userError) {
            console.log(userError)
          }

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

    message.value =
      "❌ Failed to load documents"
  }

  loading.value = false
}

// 🔥 filter users
const filteredUsers = computed(() => {

  return users.value.filter(u =>
    (u.name || u.email)
      .toLowerCase()
      .includes(
        userSearch.value.toLowerCase()
      )
  )
})

// 🔥 filter docs
const filteredDocs = computed(() => {

  return documents.value.filter(doc => {

    const matchesSearch =
      doc.title
        .toLowerCase()
        .includes(search.value.toLowerCase())

    const matchesUser =
      !selectedUser.value ||
      doc.users.some(
        u => u.id === selectedUser.value
      )

    return matchesSearch && matchesUser
  })
})

// 🔥 delete doc
const deleteDoc = async (id) => {

  if (!confirm("Delete this document?")) {
    return
  }

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const token = session?.access_token

  if (!token) {
    alert("Please login again")
    return
  }

  await $fetch("/api/delete-document", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`
    },

    body: { id }
  })

  fetchDocuments()
}

// 🔥 remove user
const removeUser = async (docId, userId) => {

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const token = session?.access_token

  if (!token) {
    alert("Please login again")
    return
  }

  await $fetch("/api/unassign-document", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`
    },

    body: {
      document_id: docId,
      user_id: userId
    }
  })

  fetchDocuments()
}

// 🚀 init
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

  padding: 28px;

  background: #F5F7FB;
}

/* ========================= */
/* CONTAINER */
/* ========================= */

.container {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;
}

/* ========================= */
/* TITLE */
/* ========================= */

h1 {
  font-size: 42px;
  font-weight: 800;

  color: #0F172A;

  margin-bottom: 24px;

  letter-spacing: -1px;
}

/* ========================= */
/* FILTERS */
/* ========================= */

.filters {
  display: grid;
  grid-template-columns: 1fr 320px;

  gap: 14px;

  margin-bottom: 20px;
}

/* INPUTS */

.filters input {
  width: 100%;

  height: 56px;

  padding: 0 18px;

  border-radius: 16px;

  border: 1px solid #D7DFEA;

  background: white;

  color: #0F172A;

  font-size: 15px;
  font-weight: 500;

  outline: none;

  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;
}

/* FOCUS */

.filters input:focus {
  border-color: #2563EB;

  box-shadow:
    0 0 0 4px rgba(37,99,235,0.10);
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
}

/* ========================= */
/* DROPDOWN */
/* ========================= */

.dropdown {
  position: absolute;

  top: calc(100% + 8px);

  left: 0;
  right: 0;

  max-height: 240px;

  overflow-y: auto;

  background: white;

  border-radius: 16px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 12px 30px rgba(15,23,42,0.08);

  z-index: 50;
}

/* OPTION */

.option {
  padding: 14px 16px;

  cursor: pointer;

  color: #334155;

  font-weight: 500;

  transition: background 0.2s ease;
}

.option:hover {
  background: #EFF6FF;
}

/* NO RESULT */

.no-result {
  padding: 14px 16px;

  color: #94A3B8;
}

/* ========================= */
/* STATES */
/* ========================= */

.empty {
  text-align: center;

  padding: 40px 20px;

  border-radius: 20px;

  background: white;

  border: 1px solid #E2E8F0;

  color: #64748B;

  font-size: 15px;
}

/* ========================= */
/* LIST */
/* ========================= */

.list {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

/* ========================= */
/* CARD */
/* ========================= */

.card {
  background: white;

  padding: 22px;

  border-radius: 22px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 4px 14px rgba(15,23,42,0.04);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 24px rgba(15,23,42,0.06);
}

/* ========================= */
/* TOP */
/* ========================= */

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;
}

/* TITLE */

.title {
  font-size: 22px;
  font-weight: 700;

  color: #0F172A;
}

/* ========================= */
/* DELETE BUTTON */
/* ========================= */

.delete {
  border: none;

  height: 44px;

  padding: 0 18px;

  border-radius: 14px;

  background: #FEE2E2;

  color: #DC2626;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.delete:hover {
  background: #FECACA;

  transform: translateY(-1px);
}

/* ========================= */
/* USERS */
/* ========================= */

.users {
  margin-top: 16px;
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

  padding: 8px 14px;

  border-radius: 999px;

  background: #E8F0FE;

  color: #2563EB;

  font-size: 13px;
  font-weight: 600;
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
/* MOBILE */
/* ========================= */

@media (max-width: 768px) {

  .wrapper {
    padding: 18px;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 32px;
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
}

</style>