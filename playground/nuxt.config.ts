export default defineNuxtConfig({
  modules: ['../src/module'],

  runtimeConfig: {
    deepl: {
      apiKey: process.env.NUXT_DEEPL_API_KEY,
    },
  },

  deeplModule: {
    defaultLanguage: 'de',
    apiType: 'free',
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-10-19',
})
