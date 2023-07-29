import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-socket-io'],
  io: {
    // module options
    sockets: [
      {
        name: 'main',
        url: 'ws://localhost:4000',
      },
    ],
  },
});
