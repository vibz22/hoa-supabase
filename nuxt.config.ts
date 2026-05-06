// export default defineNuxtConfig({
//   srcDir: 'app',
//   runtimeConfig: {
//     public: {
//       supabaseUrl: process.env.SUPABASE_URL,
//       supabaseAnonKey: process.env.SUPABASE_ANON_KEY  
//     },
//     supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY
//   }
// })

// export default defineNuxtConfig({
//   runtimeConfig: {
//     supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
//     public: {
//       supabaseUrl: process.env.SUPABASE_URL,
//       supabaseAnonKey: process.env.SUPABASE_ANON_KEY
//     }
//   }
// })

// export default defineNuxtConfig({
//     devtools: { enabled: false },
//   runtimeConfig: {
//     supabaseServiceKey: '',
//     public: {
//       supabaseUrl: '',
//       supabaseAnonKey: ''
//     }
//   }
// })

export default defineNuxtConfig({
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,

    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }
})