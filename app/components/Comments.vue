<script setup>
import { ref, onMounted } from "vue"
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore"

const props = defineProps({
  postId: String
})

const { $db, $auth } = useNuxtApp()

const comments = ref([])
const text = ref("")

const fetchComments = async () => {
  const snap = await getDocs(
    collection($db, "posts", props.postId, "comments")
  )

  comments.value = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const addComment = async () => {
  if (!text.value) return

  await addDoc(
    collection($db, "posts", props.postId, "comments"),
    {
      text: text.value,
      userEmail: $auth.currentUser.email,
      createdAt: serverTimestamp()
    }
  )

  text.value = ""
  await fetchComments()
}

const formatDate = (timestamp) => {
  if (!timestamp) return ""

  return timestamp.toDate().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  })
}
onMounted(fetchComments)
</script>

<template>
  <div class="comments">

    <div v-for="c in comments" :key="c.id" class="comment">
      <p>{{ c.text }}</p>
      <small>{{ c.userEmail }} • {{ formatDate(c.createdAt) }}</small>
    </div>

    <input v-model="text" placeholder="Write comment..." />
    <button @click="addComment">Send</button>

  </div>
</template>

<style scoped>
.comments {
  margin-top: 10px;
}

.comment {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
</style>