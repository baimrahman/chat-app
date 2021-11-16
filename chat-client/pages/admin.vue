<template>
  <div>
    <div>
      <button
        v-for="(room, index) in rooms"
        :key="index"
        @click="joinRoom(room)"
      >
        {{ room }}
      </button>
      <button v-if="selectedRoom != null" @click="closeWs">Leave Room</button>
    </div>
    <div id="messages">
      <div v-for="(payload, index) in messages" :key="index">
        <button>{{ payload.id }}</button>
        {{ payload.msg }}
      </div>
    </div>
    <div v-if="selectedRoom != null">
      <input v-model="message" type="text" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
let socket;

export default {
  data() {
    return {
      message: "",
      rooms: [],
      messages: [],
      selectedRoom: null,
    };
  },
  beforeMount() {
    socket = io("ws://localhost:4000", {
      auth: {
        username: "admin",
        password: "123",
      },
    });
    socket.on("roomList", (rooms) => {
      this.rooms = rooms;
    });
    socket.on("message", (payload) => {
      this.messages.push(payload);
    });
    socket.on("admin-joined", (room) => {
      console.log("admin joined to", room);
      this.selectedRoom = room;
    });
    socket.emit("admin-connect");
  },
  methods: {
    joinRoom(room) {
      socket.emit("admin-join", room);
      this.selectedRoom = null;
      this.messages = [];
    },
    sendMessage() {
      socket.emit("admin-send-message", {
        room: this.selectedRoom,
        msg: this.message,
      });
      this.message = "";
    },
    closeWs() {
      socket.emit("admin-unsubscribe", this.selectedRoom);
      this.selectedRoom = null;
      this.messages = [];
    },
  },
};
</script>