<template>
  <div class = "flex-me">
    <div id="nav">
      <router-link to="/users">Users</router-link> 
    </div>
    <div id="vue-instance">
      <div class="chat-container full-width" ref="chatContainer">
        <div class="title-header">
          <h1>OPEN CRYPTOCHAT</h1>
          <h2>
            A minimalist, open-source, end-to-end encrypted chat application.
          </h2>
          <p>
            Disclaimer - This website is part of a tutorial on end-to-end webapp
            encryption, and is intended to be used as a learning resource.
            Please do not use it to share sensitive information.
          </p>
          <p class="yellow">
            To learn how to build your own encrypted chat app, check out the
            <a
              class="blog-plug"
              target="_blank"
              rel="noopener"
              href="https://blog.patricktriest.com"
              >tutorial</a
            >.
          </p>
        </div>
        <div class="message-list">
          <div
            class="message full-width"
            v-for="message in messages"
            v-bind:key="message.text"
          >
            <p>
              <span
                v-bind:class="message.sender == username ? 'green' : 'red'"
                >{{ message.sender }}</span
              >
              > {{ message.text }}
            </p>
          </div>
        </div>
      </div>
      <div class="info-container full-width">
        <h1>CHATROOM</h1>
        <div class="room-select">
          <input
            type="text"
            class="full-width"
            placeholder="Room Name"
            id="room-input"
            v-model="currentRoom"
          />
          <input
            class="yellow-button full-width"
            type="submit"
            v-on:click="joinRoom()"
            value="JOIN"
          />
        </div>
        <div class="divider"></div>
        <div class="notification-list" ref="notificationContainer">
          <h1>NOTIFICATION LOG</h1>
          <div
            class="notification full-width"
            v-for="notification in notifications"
            v-bind:key="notification.message"
          >
            <div class="notification-timestamp">
              {{ notification.timestamp }}
            </div>
            <div class="notification-message">{{ notification.message }}</div>
          </div>
        </div>
        <div class="flex-fill"></div>
        <div class="divider"></div>
        <div class="keys full-width">
          <h1>KEYS</h1>
          <h2>THEIR PUBLIC KEY</h2>
          <div class="key red" v-if="destinationPublicKey">
            <p>{{ destinationPublicKey }}</p>
          </div>
          <h2 v-else>Waiting for second user to join room...</h2>
          <div class="divider"></div>
          <h2>YOUR PUBLIC KEY</h2>
          <div class="key green" v-if="originPublicKey">
            <p>{{ originPublicKey }}</p>
          </div>
          <div class="keypair-loader full-width" v-else>
            <div class="center-x loader"></div>
            <h2 class="center-text">Generating Keypair...</h2>
          </div>
        </div>
      </div>
      <div class="bottom-bar full-width">
        >
        <input
          class="message-input"
          type="text"
          placeholder="Message"
          v-model="draft"
          @keyup.enter="sendMessage()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getRoomName } from "@/core/services/RoomService";
import * as lsService from "@/core/services/LocalHostService";
import { getPublicFromCertif } from "../certif/certificateManager.js";
import { encrypt, decrypt } from "@/core/services/Crypto.js";

export default {
  name: "Chat",
  data() {
    return {
      originPublicKey: lsService.getConnectedPub(), // this is okay already got it from local storage

      originPrivateKey: lsService.getConnectedPriv(),

      destinationPublicKey: getPublicFromCertif(lsService.getDestCertif()),

      destUsername: lsService.getDestUsername(),

      username: lsService.getConnectedUsername(),

      messages: [],
      notifications: [],
      currentRoom: "",
      draft: "",
    };
  },
  created() {
    console.log("THIS VUE IS NOW HERE CREATED");

    this.$socket.emit("JOIN_CHAT", { username: this.username });

    this.currentRoom = getRoomName(this.username, this.destUsername);

    this.$socket.emit("JOIN_ROOM", { roomName: this.currentRoom });
  },
  sockets: {
    connect: function () {},
    ROOM_JOINED: function (data) {
      this.addNotification(`Room Joined ${data}`);
    },
    MESSAGE: function (message) {
      if (message.recipient == this.username && message.roomName == this.currentRoom) {
        console.log("A message Was recieved here !");
        // TODO: decrypt message.text with this user's private key

        message.text = decrypt(this.originPrivateKey, message.text);

        this.messages.push(message);
      }
    },
  },
  methods: {
    /** Append a notification message in the UI */
    addNotification(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.notifications.push({ message, timestamp });
    },
    async sendMessage() {
      // Don't send message if there is nothing to send
      if (!this.draft || this.draft === "") {
        return;
      }

      let message = {
        text: this.draft,
        recipient: this.destUsername,
        sender: this.username,
        roomName: this.currentRoom,
      };

      // Reset the UI input draft text
      this.draft = "";

      let encryptedMsg = Object.assign({}, message);

      // Instantly add (unencrypted) message to local UI
      this.addMessage(message);

      // TODO: encrypt the message.text with the other user's public key

      encryptedMsg.text = encrypt(this.destinationPublicKey, message.text);

      this.$socket.emit("MESSAGE", encryptedMsg);
    },
    addMessage(message) {
      this.messages.push(message);
      this.autoscroll(this.$refs.chatContainer);
    },
    /** Autoscoll DOM element to bottom */
    autoscroll(element) {
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
/* Global */
:root {
  --black: #111111;
  --light-grey: #d6d6d6;
  --highlight: yellow;
}

body {
  background: var(--black);
  color: var(--light-grey);
  font-family: "Roboto Mono", monospace;
  height: 100vh;
  display: flex;
  padding: 0;
  margin: 0;
}

div {
  box-sizing: border-box;
}
input,
textarea,
select {
  font-family: inherit;
  font-size: small;
}
textarea:focus,
input:focus {
  outline: none;
}

.full-width {
  width: 100%;
}
.green {
  color: green;
}
.red {
  color: red;
}
.yellow {
  color: yellow;
}
.center-x {
  margin: 0 auto;
}
.center-text {
  width: 100%;
  text-align: center;
}

h1,
h2,
h3 {
  font-family: "Montserrat", sans-serif;
}
h1 {
  font-size: medium;
}
h2 {
  font-size: small;
  font-weight: 300;
}
h3 {
  font-size: x-small;
  font-weight: 300;
}
p {
  font-size: x-small;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}

#vue-instance {
  display: flex;
  flex-direction: row;
  flex: 1 0 100%;
  overflow-x: hidden;
}

/** Chat Window **/
.chat-container {
  flex: 0 0 60%;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 6px;
  margin-bottom: 50px;
}

.message > p {
  font-size: small;
}
.title-header > p {
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
}

/* Info Panel */
.info-container {
  flex: 0 0 40%;
  border-left: solid 1px var(--light-grey);
  padding: 12px;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-bottom: 50px;
  position: relative;
  justify-content: space-around;
  display: flex;
  flex-direction: column;
}

.divider {
  padding-top: 1px;
  max-height: 0px;
  min-width: 200%;
  background: var(--light-grey);
  margin: 12px -12px;
  flex: 1 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding-bottom: 24px;
  flex: 1 0 40%;
}

.notification {
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  font-size: small;
  padding: 4px 0;
  display: inline-flex;
}

.notification-timestamp {
  flex: 0 0 20%;
  padding-right: 12px;
}

.notification-message {
  flex: 0 0 80%;
}
.notification:last-child {
  margin-bottom: 24px;
}

.keys {
  display: block;
  font-size: xx-small;
  overflow-x: hidden;
  overflow-y: scroll;
}

.keys > .divider {
  width: 75%;
  min-width: 0;
  margin: 16px auto;
}

.key {
  overflow: scroll;
}

.room-select {
  display: flex;
  min-height: 24px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
}

#room-input {
  flex: 0 0 60%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--light-grey);
  border-top: 1px solid var(--light-grey);
  border-left: 1px solid var(--light-grey);
  color: var(--light-grey);
  padding: 4px;
}

.yellow-button {
  flex: 0 0 30%;
  background: none;
  border: 1px solid var(--highlight);
  color: var(--highlight);
  cursor: pointer;
}

.yellow-button:hover {
  background: var(--highlight);
  color: var(--black);
}

.yellow > a {
  color: var(--highlight);
}

.loader {
  border: 4px solid black;
  border-top: 4px solid var(--highlight);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Message Input Bar */
.message-input {
  background: none;
  border: none;
  color: var(--light-grey);
  width: 90%;
}

.bottom-bar {
  border-top: solid 1px var(--light-grey);
  background: var(--black);
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 12px;
  height: 48px;
}

.message-list {
  margin-bottom: 40px;
}

.flex-me{
  display: flex;
  flex-direction: row;
}
</style>