<script setup>
definePageMeta({
  ssr: false
})
import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const documents = ref([])
const loading = ref(false)
const message = ref("")
const fileUrl = ref("")

// 🔥 fetch user docs
const fetchDocuments = async () => {
  loading.value = true

  const session = await supabase.auth.getSession()

  const res = await $fetch("/api/my-documents", {
    headers: {
      Authorization: `Bearer ${session.data.session.access_token}`
    }
  })

  if (res.error) {
    message.value = "❌ " + res.error
  } else {
    documents.value = res.documents || []
  }

  loading.value = false
}

// 🔥 open doc
const openDocument = async (id) => {
  const session = await supabase.auth.getSession()

  const res = await $fetch("/api/open-document", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.data.session.access_token}`
    },
    body: { id }
  })

  if (res.error) {
    message.value = "❌ " + res.error
  } else {
    fileUrl.value = res.url
    message.value = ""
  }
}

onMounted(fetchDocuments)
</script>

<template>
  <div class="wrapper">
    <div class="box">
      <h1>My Documents</h1>

      <div v-if="loading">Loading...</div>

      <div v-else-if="documents.length === 0">
        No documents available
      </div>

      <div v-else>
        <div v-for="doc in documents" :key="doc.id" class="doc">
          <div>
            <strong>{{ doc.title }}</strong>
          </div>

          <button @click="openDocument(doc.id)">
            Open
          </button>
        </div>
      </div>

      <p v-if="message" class="message">{{ message }}</p>

      <!-- 🔥 preview -->
      <iframe
        v-if="fileUrl"
        :src="fileUrl"
        class="viewer"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>

*{
  box-sizing:border-box;
}

/* ====================== */
/* PAGE */
/* ====================== */

.wrapper{
  min-height:100vh;

  padding:40px 20px;

  display:flex;
  justify-content:center;

  background:
  linear-gradient(
    135deg,
    #fdf2f8,
    #f8fafc,
    #ecfeff
  );
}

/* ====================== */
/* CONTAINER */
/* ====================== */

.box{
  width:100%;
  max-width:900px;
}

/* ====================== */
/* TITLE */
/* ====================== */

h1{
  font-size:42px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:28px;
}

/* ====================== */
/* STATES */
/* ====================== */

.box > div{
  color:#64748b;

  font-size:15px;
}

/* ====================== */
/* DOCUMENT CARD */
/* ====================== */

.doc{
  display:flex;
  justify-content:space-between;
  align-items:center;

  gap:20px;

  padding:22px;

  margin-bottom:18px;

  border-radius:28px;

  background:rgba(255,255,255,0.82);

  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);

  border:1px solid #e2e8f0;

  box-shadow:
  0 10px 35px rgba(15,23,42,0.05);

  transition:0.25s ease;

  animation:fadeUp 0.45s ease;
}

/* HOVER */

.doc:hover{
  transform:translateY(-4px);

  box-shadow:
  0 18px 40px rgba(99,102,241,0.10);
}

/* TITLE */

.doc strong{
  font-size:18px;
  font-weight:700;

  color:#0f172a;
}

/* ====================== */
/* BUTTON */
/* ====================== */

button{
  border:none;

  padding:12px 22px;

  border-radius:16px;

  cursor:pointer;

  font-size:14px;
  font-weight:700;

  color:white;

  background:
  linear-gradient(
    135deg,
    #6366f1,
    #8b5cf6
  );

  box-shadow:
  0 10px 25px rgba(99,102,241,0.20);

  transition:0.25s ease;
}

/* HOVER */

button:hover{
  transform:translateY(-2px);

  box-shadow:
  0 18px 35px rgba(99,102,241,0.28);
}

/* ====================== */
/* MESSAGE */
/* ====================== */

.message{
  margin-top:20px;

  padding:16px 18px;

  border-radius:18px;

  background:#eff6ff;

  color:#2563eb;

  font-size:14px;
  font-weight:600;
}

/* ====================== */
/* PDF VIEWER */
/* ====================== */

.viewer{
  width:100%;

  height:700px;

  margin-top:28px;

  border:none;

  border-radius:28px;

  background:white;

  box-shadow:
  0 12px 35px rgba(15,23,42,0.08);

  animation:fadeUp 0.5s ease;
}

/* ====================== */
/* ANIMATION */
/* ====================== */

@keyframes fadeUp{

  from{
    opacity:0;
    transform:translateY(20px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* ====================== */
/* TABLET */
/* ====================== */

@media(max-width:768px){

  h1{
    font-size:34px;
  }

  .viewer{
    height:600px;
  }
}

/* ====================== */
/* MOBILE */
/* ====================== */

@media(max-width:480px){

  .wrapper{
    padding:18px 12px;
  }

  h1{
    font-size:28px;
  }

  .doc{
    flex-direction:column;
    align-items:flex-start;

    padding:18px;

    border-radius:24px;
  }

  button{
    width:100%;
  }

  .viewer{
    height:500px;

    border-radius:22px;
  }
}

</style>
