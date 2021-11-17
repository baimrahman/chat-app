<template>
  <div>
    <button v-if="joinShow" @click="joinRoom">Join Room</button>
    <button v-if="!joinShow" @click="closeWs">Leave Room</button>
    <div id="messages">
      <div v-for="(payload, index) in messages" :key="index">
        <button>{{ payload.id }}</button>
        {{ payload.msg }}
      </div>
    </div>
    <div v-if="!joinShow && messages.length === 0">
      Waiting admin to connect
    </div>
    <div v-if="!joinShow && messages.length >= 1">
      <input v-model="message" type="text" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
let socket;

export default {
  name: "App",
  data() {
    return {
      message: "",
      messages: [],
      joinShow: true,
    };
  },
  beforeMount() {
    socket = io("ws://localhost:4000", {
      auth: {
        username: this.$route.query.username,
        password: "123",
      },
    });
    socket.on("connect", (sc) => {
      console.log("ws connected");
    });
    socket.on("message", (message) => {
      this.messages.push(message);
    });
    socket.on("joined", (sc) => {
      if (sc) {
        this.joinShow = false;
      }
    });
    socket.on("unsubscribed", (sc) => {
      if (sc) {
        this.joinShow = true;
      }
    });
  },
  methods: {
    closeWs() {
      socket.emit("unsubscribe");
      this.messages = [];
    },
    sendMessage() {
      socket.emit("send-message", this.message);
      this.message = "";
    },
    joinRoom() {
      socket.emit("join");
    },
  },
};
</script>