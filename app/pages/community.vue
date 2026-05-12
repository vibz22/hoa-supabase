<!-- <script setup>

definePageMeta({
  layout: 'default'
})

import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const user = ref(null)
const posts = ref([])
const newPost = ref("")
const loading = ref(true)

// 🔥 map user_id → email
const userMap = ref({})

// 🔥 map user_id → role
const userRoles = ref({})

// 🔐 LOAD USER + POSTS + USERS
onMounted(async () => {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    navigateTo("/login")
    return
  }

  user.value = data.user

  // 🔍 FETCH POSTS
  const { data: postData } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  posts.value = postData || []

  // 🔍 FETCH USERS (email + role)
  const { data: usersData } = await supabase
    .from("users")
    .select("id, email, role")

  if (usersData) {
    userMap.value = Object.fromEntries(
      usersData.map(u => [u.id, u.email])
    )

    userRoles.value = Object.fromEntries(
      usersData.map(u => [u.id, u.role])
    )
  }

  loading.value = false
})

// ➕ ADD POST (UNCHANGED)
const addPost = async () => {
  if (!newPost.value.trim()) return

  await supabase.from("posts").insert({
    user_id: user.value.id,
    content: newPost.value
  })

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  posts.value = data || []
  newPost.value = ""
}
</script>

<template>
  <div class="wrapper">
    <div class="login-box">

      <h1>Community</h1>

      <div v-if="loading">
        <p>Loading...</p>
      </div>

      <div v-else>

        <textarea v-model="newPost" placeholder="Write something..."></textarea>
        <button @click="addPost">Post</button>

        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post"
          :class="{ admin: userRoles[post.user_id] === 'admin' }"
        >
          <div class="header">
            
         
            <div class="avatar">
              {{
                userMap[post.user_id]
                  ? userMap[post.user_id].charAt(0).toUpperCase()
                  : 'U'
              }}
            </div>

            <small>
              {{ userMap[post.user_id] || 'unknown' }} • 
              {{ new Date(post.created_at).toLocaleString() }}
            </small>

          </div>

          <p>{{ post.content }}</p>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #020617, #0f172a, #1e293b);
}

.login-box {
  width: 100%;
  max-width: 500px;
  color: white;
}

textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  color: white;
}

button {
  padding: 12px;
  width: 100%;
  background: #6366f1;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
  border: none;
}

/* POSTS */
.post {
  background: rgba(255,255,255,0.05);
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  transition: 0.2s;
}

.post:hover {
  background: rgba(255,255,255,0.08);
}

/* 🔥 ADMIN */
.post.admin {
  background: #fef3c7;
  border-left: 6px solid #f59e0b;
  color: black;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

/* AVATAR */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.post.admin .avatar {
  background: #f59e0b;
}
</style> -->

<script setup>

definePageMeta({
  layout: 'default'
})

import { ref, onMounted } from "vue"

const supabase = useNuxtApp().$supabase

const user = ref(null)
const posts = ref([])
const newPost = ref("")
const loading = ref(true)

// 🔥 EXISTING (kept)
const userMap = ref({})
const userRoles = ref({})

// 🆕 COMMENTS STATE (added)
const comments = ref({})
const newComments = ref({})

let postsChannel = null
let commentsChannel = null

// 🔐 LOAD USER + POSTS + USERS
onMounted(async () => {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    navigateTo("/login")
    return
  }

  user.value = data.user

  // 🔍 FETCH POSTS (UNCHANGED)
  const { data: postData } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  posts.value = postData || []

  // 🔍 FETCH USERS (UNCHANGED)
  const { data: usersData } = await supabase
    .from("users")
    .select("id, email, role")

  if (usersData) {
    userMap.value = Object.fromEntries(
      usersData.map(u => [u.id, u.email])
    )

    userRoles.value = Object.fromEntries(
      usersData.map(u => [u.id, u.role])
    )
  }

  // 🆕 FETCH COMMENTS
  await fetchComments()

  // 🔥 REALTIME POSTS
if (!postsChannel) {

  postsChannel = supabase
    .channel("community-posts")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "posts"
      },

      async () => {

        const { data } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false })

        posts.value = data || []
      }
    )

    .subscribe()
}

// 🔥 REALTIME COMMENTS
if (!commentsChannel) {

  commentsChannel = supabase
    .channel("community-comments")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comments"
      },

      async () => {
        await fetchComments()
      }
    )

    .subscribe()
}

  loading.value = false
})

// ➕ ADD POST (UNCHANGED)
const addPost = async () => {
  if (!newPost.value.trim()) {
  alert("Please write a message")
  return
  }

  await supabase.from("posts").insert({
    user_id: user.value.id,
    content: newPost.value
  })

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  posts.value = data || []
  newPost.value = ""
}

// 🆕 FETCH COMMENTS
const fetchComments = async () => {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true })

  comments.value = {}

  data?.forEach(c => {
    if (!comments.value[c.post_id]) {
      comments.value[c.post_id] = []
    }
    comments.value[c.post_id].push(c)
  })
}

// 🆕 ADD COMMENT
const addComment = async (postId) => {
  const text = newComments.value[postId]
  if (!text?.trim()) {
   alert("Please write a comment")
  return
  }
  await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.value.id,
    content: text
  })

  newComments.value[postId] = ""

  await fetchComments()
}
</script>

<template>
  <div class="wrapper">
    <div class="login-box">

      <h1>Community</h1>

      <div v-if="loading">
        <p>Loading...</p>
      </div>

      <div v-else>

        <!-- EXISTING -->
        <textarea v-model="newPost" placeholder="Write something..."></textarea>
        <button @click="addPost">Post</button>

        <!-- POSTS -->
        <div 
          v-for="post in posts" 
          :key="post.id" 
       :class="[
  'post',
  { 
    admin: userRoles[post.user_id] === 'admin',
    self: post.user_id === user.id
  }
]"
        >
          <div class="header">

            <!-- EXISTING AVATAR -->
            <div class="avatar">
              {{
                userMap[post.user_id]
                  ? userMap[post.user_id].charAt(0).toUpperCase()
                  : 'U'
              }}
            </div>

            <!-- <small>
              {{ userMap[post.user_id] || 'unknown' }} • 
              {{ new Date(post.created_at).toLocaleString() }}
            </small>-->
           <small>
              {{ userMap[post.user_id] || 'unknown' }}

              <span v-if="userRoles[post.user_id] === 'admin'" class="admin-tag">
                ADMIN
              </span>

              • {{ new Date(post.created_at).toLocaleString() }}
            </small>

          </div>

          <p>{{ post.content }}</p>

          <!-- 🆕 COMMENTS -->
          <div class="comments">

            <!-- LIST -->
            <div 
              v-for="c in comments[post.id] || []" 
              :key="c.id" 
              class="comment"
            >
              <small>{{ userMap[c.user_id] || 'user' }}</small>
              <p>{{ c.content }}</p>
            </div>

            <!-- INPUT -->
            <div class="comment-input">
              <input 
                v-model="newComments[post.id]" 
                placeholder="Write comment..." 
              />
              <button @click="addComment(post.id)">Send</button>
            </div>

          </div>

        </div>

      </div>

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

.login-box{
  width:100%;
  max-width:920px;
}

/* ====================== */
/* TITLE */
/* ====================== */

h1{
  font-size:42px;
  font-weight:800;

  color:#0f172a;

  margin-bottom:26px;
}

/* ====================== */
/* CREATE POST */
/* ====================== */

textarea{
  width:100%;

  min-height:130px;

  padding:22px;

  border:none;

  border-radius:28px;

  background:white;

  font-size:15px;

  color:#334155;

  outline:none;

  resize:none;

  box-shadow:
  0 10px 30px rgba(0,0,0,0.04);

  transition:0.25s;
}

textarea:focus{
  transform:translateY(-2px);

  box-shadow:
  0 20px 40px rgba(236,72,153,0.10);
}

textarea::placeholder{
  color:#94a3b8;
}

/* ====================== */
/* BUTTON */
/* ====================== */

button{
  border:none;

  cursor:pointer;

  transition:0.25s;
}

/* POST BUTTON */

textarea + button{
  margin-top:16px;
  margin-bottom:42px;

  padding:14px 28px;

  border-radius:18px;

  background:
  linear-gradient(
    135deg,
    #ec4899,
    #8b5cf6
  );

  color:white;

  font-size:15px;
  font-weight:700;

  box-shadow:
  0 10px 25px rgba(236,72,153,0.22);
}

textarea + button:hover{
  transform:translateY(-2px);
}

/* ====================== */
/* POSTS */
/* ====================== */

.post{
  width:78%;

  padding:24px;

  border-radius:30px;

  background:white;

  margin-bottom:34px;

  box-shadow:
  0 12px 35px rgba(15,23,42,0.06);

  animation:fadeUp 0.4s ease;

  transition:0.25s;
}

/* NORMAL USER POSTS */

.post:hover{
  transform:translateY(-4px);
}

/* ====================== */
/* SELF */
/* ====================== */

.post.self{
  margin-left:auto;

  background:
  linear-gradient(
    135deg,
    #0f172a,
    #1e293b,
    #334155
  );

  color:white;

  border:none;

  box-shadow:
  0 18px 40px rgba(15,23,42,0.22);
}

/* ====================== */
/* ADMIN POSTS */
/* ====================== */
.admin-tag{
  margin-left:8px;

  padding:3px 8px;

  border-radius:999px;

  font-size:10px;
  font-weight:700;

  letter-spacing:0.5px;

  background:#f59e0b;

  color:white;
}
.post.admin{
  /* margin-left:auto; */

  background:
  linear-gradient(
    135deg,
    #7c3aed,
    #6366f1
  );

  color:white;

  border:none;

  box-shadow:
  0 18px 40px rgba(99,102,241,0.24);
}

/* ====================== */
/* HEADER */
/* ====================== */

.header{
  display:flex;
  align-items:center;

  gap:12px;

  margin-bottom:18px;
}

/* ====================== */
/* AVATAR */
/* ====================== */

.avatar{
  width:46px;
  height:46px;

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  font-weight:700;

  flex-shrink:0;

  color:white;

  background:
  linear-gradient(
    135deg,
    #ec4899,
    #8b5cf6
  );
}

/* SELF AVATAR */

.post.self .avatar,
.post.admin .avatar{
  background:rgba(255,255,255,0.18);
}

/* ====================== */
/* USER INFO */
/* ====================== */

small{
  font-size:12px;

  color:#64748b;
}

.post.self small,
.post.admin small{
  color:rgba(255,255,255,0.72);
}

/* ====================== */
/* CONTENT */
/* ====================== */

.post p{
  font-size:15px;

  line-height:1.9;

  margin:0;
}

/* ====================== */
/* COMMENTS */
/* ====================== */

.comments{
  margin-top:24px;

  padding-top:20px;

  border-top:1px solid rgba(255,255,255,0.10);

  display:flex;
  flex-direction:column;

  gap:14px;
}

/* ====================== */
/* COMMENT */
/* ====================== */

.comment{
  padding:16px 18px;

  border-radius:20px;

  background:#f8fafc;
}

/* COMMENT TEXT */

.comment p{
  color:#334155;

  font-size:14px;

  margin-top:4px;
}

/* ADMIN COMMENT */

.post.admin .comment{
  background:rgba(255,255,255,0.14);
}

.post.admin .comment p,
.post.admin .comment small{
  color:white;
}

/* SELF COMMENT */

.post.self .comment{
  background:rgba(255,255,255,0.10);
}

.post.self .comment p,
.post.self .comment small{
  color:white;
}

/* ====================== */
/* COMMENT INPUT */
/* ====================== */

.comment-input{
  display:flex;

  gap:10px;

  margin-top:4px;
}

/* INPUT */

.comment-input input{
  flex:1;

  height:48px;

  border:none;

  border-radius:16px;

  padding:0 16px;

  background:white;

  outline:none;

  font-size:14px;

  color:#0f172a;

  box-shadow:
  inset 0 0 0 1px #e2e8f0;
}

/* SEND BUTTON */

.comment-input button{
  height:48px;

  padding:0 22px;

  border-radius:16px;

  background:
  linear-gradient(
    135deg,
    #06b6d4,
    #3b82f6
  );

  color:white;

  font-weight:700;

  box-shadow:
  0 8px 20px rgba(59,130,246,0.22);
}

.comment-input button:hover{
  transform:translateY(-2px);
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

  .post{
    width:100%;
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

  textarea{
    min-height:110px;

    padding:16px;
  }

  .post{
    width:100%;

    padding:18px;

    border-radius:24px;
  }

  .comment-input{
    flex-direction:column;
  }

  .comment-input button{
    width:100%;
  }
}

</style>
