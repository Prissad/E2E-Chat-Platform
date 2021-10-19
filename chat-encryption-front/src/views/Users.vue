<template>
  <div v-if="!isFetching" id="users" class="columns">
    <div class="column">
      <div class="title">Bonjour "{{ username }}" ! Ravi de vous revoir !</div>
      <button class="is-primary button" @click="shuffle">Shuffle!</button>
      <div
        v-for="user in users"
        :user="user"
        :key="user.pseudo"
        @click="gotoUserChat(user.pseudo)"
      >
        <div class="user">
          <div class="box">
            <article class="media">
              <div class="media-left">
                <figure class="cercle-lettre">
                  <p>{{ user.pseudo[0] }}</p>

                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ user.pseudo }} <span v-if = "user.connected"> - Connected </span></strong>
                    <br />
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import for shuffle
import _ from 'lodash';
// import for font awesome icons
import { library } from '@fortawesome/fontawesome-svg-core';

/*
 * import { name of your icon in camelCase } from "@fortawesome/free-solid-svg-icons";
 * For example, I want to use fa-enveloper-open-text, then it's faEnvelopeOpenText
 */
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
/*
 * Then add it to library
 */
library.add(faEnvelope)
library.add(faHeart)

import * as getUsers from "@/core/services/UsersService";

import {setDestUsername, setDestCertif} from "@/core/services/LocalHostService";

var isFetching = true;
var users = [];

async function getusers() {

  await getUsers.getUsersList()
      .then(
          async (res) => {
            users = await res.data.filter(entry => !Array.isArray(entry.pseudo) && !Array.isArray(entry.pseudo));
            isFetching = false;
          }
      )
      .catch(
          (error) => {
            console.log(error);
          }
      );
}

import * as getLocal from "@/core/local/getLocal";

function getLocalUsername() {
  return getLocal.getLocalStorageData().username;
}

getusers();

export default {
  name: "Users",
  data() {
    return {
      isFetching: isFetching,
      users: users.filter(user => user.pseudo != getLocalUsername()),
      username: getLocalUsername(),
    }
  },
  created(){
    console.log(this.users);
    if(!this.$joinChat){
      this.$joinChat = true;
      this.$socket.emit("JOIN_CHAT", {username : this.username});
    }
  },
  methods: {
    async shuffle() {
      await getusers();
      this.users = users.filter(user => user.pseudo != getLocalUsername())
      this.users = _.shuffle(this.users)
    },
    gotoUserChat(username){
      const user = this.users.filter(user => user.pseudo == username)[0];
      setDestUsername(user.pseudo);
      setDestCertif(user.certificate);
      this.$router.replace({name: "chat"})
    }
  },
  sockets: {
    USER_CONNECTED: function(connectedUsers) {
      console.log("CONNECTED RECIEVED", connectedUsers)
      this.users = this.users.map(function(user){
        if(connectedUsers.includes(user.pseudo)){
          user.connected = true;
        }
        return user;
      })
    },
    USER_DISCONNECTED: function(userDisc){
      console.log("DISCONNECTED RECEIVED - ", userDisc);
      const toChange = this.users.filter(user => user.pseudo == userDisc)[0];
      toChange.connected = false;
      this.$forceUpdate();
    }
  }
};

</script>
<style scoped>
html,
body {
  height: 100%;
  padding-top: 10px;
  background: #e6ecf1;
}

#users {
  height: 100%;
  padding-top: 0px;
  text-align: center;
}

#users .button {
  margin-bottom: 20px;
}

#users .user {
  max-width: 500px;
  margin: 0 auto;
  padding-bottom: 15px;
}

#users .box {
  margin-bottom: 0;
  border-radius: 0;
}

#users .content {
  text-align: start;
}

#users .content small {
  color: #00d1b2;
}

#users img {
  border-radius: 30px;
}

#users .level-item {
  padding-left: 10px;
  color: #00d1b2;
}

#users input:focus {
  border-color: #00d1b2;
}

#users .likes {
  padding: 0 7.5px;
}

#users input {
  font-weight: bold;
}

#users .users-move {
  transition: transform 1s;
}

.cercle-lettre {
  font-weight: bold;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  padding: 16px;

  background: #fff;
  border: 2px solid #666;
  color: #666;
  text-align: center;

  font-size: 20px;
}
</style>