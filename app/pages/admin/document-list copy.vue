<script setup>
import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const documents = ref([])
const loading = ref(false)
const message = ref("")

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

    // 🔥 attach users
    const enriched = await Promise.all(
  docs.map(async (doc) => {

    // 🔥 get access ONLY for this document
    const { data: access } = await supabase
      .from("document_access")
      .select("user_id")
      .eq("document_id", doc.id)

    const userIds = access?.map(a => a.user_id) || []

    let users = []

    if (userIds.length > 0) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, name, email")
        .in("id", userIds)

      users = userData || []
    }

    return {
      ...doc,
      users
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

onMounted(fetchDocuments)
</script>

<template>
  <div class="wrapper">
    <div class="container">

      <h1>📂 Document Management</h1>

      <!-- STATES -->
      <div v-if="loading" class="empty">Loading...</div>
      <div v-else-if="message" class="empty">{{ message }}</div>
      <div v-else-if="documents.length === 0" class="empty">
        No documents uploaded
      </div>

      <!-- LIST -->
      <div v-else class="list">
        <div v-for="doc in documents" :key="doc.id" class="card">

          <!-- TITLE -->
          <div class="top">
            <div class="title">
              {{ doc.title }}
            </div>

            <button class="delete" @click="deleteDoc(doc.id)">
              Delete
            </button>
          </div>

          <!-- USERS -->
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
/* 🔥 PAGE */
.wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

/* 🔥 CONTAINER */
.container {
  width: 100%;
  max-width: 800px;
  color: white;
}

/* 🔥 TITLE */
h1 {
  font-size: 26px;
  margin-bottom: 20px;
}

/* 🔥 EMPTY */
.empty {
  text-align: center;
  color: #9ca3af;
  margin-top: 40px;
}

/* 🔥 LIST */
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 🔥 CARD */
.card {
  background: rgba(255,255,255,0.05);
  padding: 16px;
  border-radius: 14px;
  transition: 0.2s;
}

.card:hover {
  background: rgba(255,255,255,0.08);
}

/* 🔥 TOP */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 🔥 TITLE */
.title {
  font-weight: 600;
  font-size: 15px;
}

/* 🔥 DELETE BUTTON */
.delete {
  background: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 13px;
}

/* 🔥 USERS */
.users {
  margin-top: 12px;
}

/* 🔥 CHIP WRAP */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 🔥 CHIP */
.chip {
  background: #6366f1;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 🔥 REMOVE */
.remove {
  cursor: pointer;
  font-size: 12px;
}

/* 🔥 NO USERS */
.no-users {
  color: #9ca3af;
  font-size: 13px;
}

/* 📱 MOBILE */
@media (max-width: 600px) {
  .top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .delete {
    width: 100%;
  }
}
</style>