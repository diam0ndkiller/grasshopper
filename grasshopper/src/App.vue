<script setup>
import Navigation from './components/Navigation.vue';
import Content from './components/Content.vue';
import { Backend } from './scripts/backend';
const sslCertTitle = "grasshopper API - Accept SSL Certificate";
const sslCertText = "This service uses an SSL certificate to ensure a secure (https) connection "+
"to the server. But because I'm no big company, I have to sign the certificate myself. Because of that, your browser "+
"doesn't accept the certificate by default. Click this link to accept the certificate manually and to ensure a secure connection.\n"+
"Your browser will probably prompt you with the information that the site is insecure. You will want to click 'Advanced' and 'Accept'.";
const sslCertNote = "After you accept, please reload this page.";
</script>

<template>
  <nav class="navigation" v-if="pingSuccessful" v-bind:class="{hiddenWhenSmall: !navigation__expanded}">
    <Suspense>
      <Navigation :notifications="notifications" :current_chat_id="o.id" @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click"/>
    </Suspense>
  </nav>
  
  <main class="content" v-if="pingSuccessful" v-bind:class="{hiddenWhenSmall: navigation__expanded}">
    <Content :current_notifications="notifications[o.id]" :o="o" @navigation-expanded-click="navigation__expand__click" @chat-options-click="chat__options__current__click"/>
  </main>

  <v-dialog v-if="pingSuccessful" v-model="showChatOptions">
    <v-card :title="'Options for Chat \''+chatForOptions.name+'\''">
      <v-card-item>
        <v-row>
          <v-col v-for="(x, index) in chatOptions" :key="index" cols="auto">
            <v-btn :prepend-icon="x.icon" :color="x.color" @click="x.action">{{ x.text }}</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showCertDialog">
    <v-card
      :title="sslCertTitle"
      :text="sslCertText"
      >
      <v-card-item>
        {{ sslCertNote }}
      </v-card-item>
      <v-card-item>
        <v-row>
          <v-col cols="auto">
            <v-btn prepend-icon="mdi-security" color="#007f7f" @click="Backend.acceptCertificate">Accept Certificate Here</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            navigation__expanded: true,
            o: {id: -1, name: "welcome"},
            chatOptions: [
              {icon: "mdi-arrow-right", text: "Open", color: "#0c0", action: this.openChat},
              {icon: "mdi-delete", text: "Delete", color: "#c00", action: this.deleteChat}
            ],
            participantOptions: {

            },
            messageOptions: {

            },
            chatForOptions: null,
            participantForOptions: null,
            messageForOptions: null,
            showChatOptions: false,
            showMessageOptions: false,
            showParticipantOptions: false,
            pingSuccessful: false,
            notifications: {},
            newestNotificationTimestamp: Math.floor(Date.now() / 1000)
        }
    },
    computed: {
      showCertDialog() {return ! this.pingSuccessful}
    },
    async mounted() {
      let pingSuccessful = (await Backend.ping()).success == true;
      if (pingSuccessful) {
        let register = await Backend.register("diam0ndkiller", "minecraft");
        console.log("register:", register);
        let login = await Backend.login("diam0ndkiller", "minecraft");
        console.log("login:", login);
        this.pingSuccessful = pingSuccessful;
      }
      setInterval(this.getNewNotifications, 1000)
    },
    methods: {
      navigation__chat__click(o) {
        this.o = o;
        this.navigation__expanded = false;
      },
      navigation__expand__click() {
        this.navigation__expanded = true;
      },
      chat__options__click(o) {
        this.chatForOptions = o;
        this.showChatOptions = true;
      },
      chat__options__current__click() {
        this.chat__options__click(this.o);
      },
      message__options__click(o) {
        this.messageOptions = o;
        this.showMessageOptions = true;
      },
      participant__options__click(o) {
        this.participantOptions = o;
        this.showParticipantOptions = true;
      },
      openChat() {
        this.showChatOptions = false;
        this.navigation__chat__click(this.chatForOptions)
      },
      deleteChat() {

      },
      async getNewNotifications() {
        let data = await Backend.getNewNotifications(this.newestNotificationTimestamp);
        data.notifications.forEach(element => {
          if (element.chat_id in this.notifications) this.notifications[element.chat_id].push(element);
          else this.notifications[element.chat_id] = [element];
        });
        this.newestNotificationTimestamp = Math.floor(Date.now() / 1000);
      }
    }
}
</script>

<style scoped>
</style>
