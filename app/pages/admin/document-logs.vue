<script setup>
import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase
const logs = ref([])
const loading = ref(false)
const message = ref("")

const fetchLogs = async () => {
  loading.value = true
  message.value = ""

  try {
    // 🔥 get logs
    const { data } = await supabase
      .from("document_logs")
      .select("*")
      .order("id", { ascending: false })

    if (!data || data.length === 0) {
      logs.value = []
      return
    }

    // 🔥 fetch related data manually (no FK dependency)
    const enriched = await Promise.all(
      data.map(async (log) => {
        const { data: user } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", log.user_id)
          .single()

        const { data: doc } = await supabase
          .from("documents")
          .select("title")
          .eq("id", log.document_id)
          .single()

        return {
          ...log,
          user,
          doc
        }
      })
    )

    logs.value = enriched

  // } catch (err) {
  //   console.error(err)
  //   message.value = "❌ Failed to load logs"
  // }
    } catch (err) {
  console.error(err)
  message.value = "❌ Failed to load logs"
} finally {
  loading.value = false   // 🔥 IMPORTANT
}

  loading.value = false
}

onMounted(fetchLogs)
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <h1>📊 Document Activity</h1>

      <!-- 🔥 loading -->
      <div v-if="loading" class="empty">Loading...</div>

      <!-- 🔥 error -->
      <div v-else-if="message" class="empty">{{ message }}</div>

      <!-- 🔥 empty -->
      <div v-else-if="logs.length === 0" class="empty">
        No activity yet
      </div>

      <!-- 🔥 logs -->
      <div v-else class="logs">
        <div v-for="log in logs" :key="log.id" class="log">
          
          <div class="top">
            <span class="user">
              {{ log.user?.name || log.user?.email || "Unknown User" }}
            </span>

            <span class="action">
              viewed
            </span>

            <span class="doc">
              {{ log.doc?.title || "Unknown Document" }}
            </span>
          </div>

          <div class="time">
            {{ new Date(log.created_at).toLocaleString() }}
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
  max-width: 950px;

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
/* LOG LIST */
/* ========================= */

.logs {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ========================= */
/* LOG CARD */
/* ========================= */

.log {
  background: rgba(255,255,255,0.82);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  padding: 22px 24px;

  border-radius: 24px;

  border: 1px solid #E2E8F0;

  box-shadow:
    0 10px 30px rgba(15,23,42,0.05);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  animation: fadeUp 0.6s ease;
}

/* HOVER */

.log:hover {
  transform: translateY(-4px);

  box-shadow:
    0 18px 40px rgba(37,99,235,0.10);
}

/* ========================= */
/* TOP ROW */
/* ========================= */

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 8px;

  font-size: 15px;
}

/* USER */

.user {
  font-weight: 700;

  color: #0F172A;
}

/* ACTION */

.action {
  color: #64748B;
}

/* DOCUMENT */

.doc {
  color: #2563EB;

  font-weight: 700;
}

/* ========================= */
/* TIME */
/* ========================= */

.time {
  margin-top: 12px;

  font-size: 13px;

  color: #94A3B8;
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

  .log {
    padding: 18px 20px;
    border-radius: 20px;
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

  .top {
    font-size: 14px;
  }

  .time {
    font-size: 12px;
  }

  .log {
    padding: 16px;
    border-radius: 18px;
  }

  .empty {
    padding: 40px 16px;
    font-size: 14px;
  }
}

</style>