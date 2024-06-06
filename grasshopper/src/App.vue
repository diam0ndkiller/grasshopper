<script setup>
import Navigation from './components/Navigation.vue';
import Content from './components/Content.vue';
import { Backend } from './scripts/backend';
import { NotificationAPI } from './scripts/notificationAPI';
const sslCertTitle = "grasshopper API - Accept SSL Certificate";
const sslCertText = "This service uses an SSL certificate to ensure a secure (https) connection "+
"to the server. But because I'm no big company, I have to sign the certificate myself. Because of that, your browser "+
"doesn't accept the certificate by default. Click this link to accept the certificate manually and to ensure a secure connection.\n"+
"Your browser will probably prompt you with the information that the site is insecure. You will want to click 'Advanced' and 'Accept'.";
const sslCertNote = "After you accept, please reload this page.";
const serverDownNote = "If you already accepted the certificate, the service might be down for maintenance. Sorry, please try again later!";
</script>

<template>
  <nav class="navigation" v-if="ready" v-bind:class="{hiddenWhenSmall: !navigation__expanded}">
    <Suspense>
      <Navigation :chatOptions="chatOptions" :notifications="notifications" :current_chat_id="o.id" @navigation-chat-click="navigation__chat__click" />
    </Suspense>
  </nav>
  
  <main class="content" v-if="ready" v-bind:class="{hiddenWhenSmall: navigation__expanded}">
    <Content :chatOptions="chatOptions" :current_notifications="notifications[o.id]" :o="o" @navigation-expanded-click="navigation__expand__click" />
  </main>

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
      <v-card-item>
        {{ serverDownNote }}
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            navigation__expanded: true,
            o: undefined,
            chatOptions: [
              {icon: "mdi-arrow-expand-left", text: "Leave", color: "#c00", action: this.leaveChat, visible: (o) => (o.id > 0)},
              {icon: "mdi-arrow-right", text: "Open", color: "#0c0", action: this.openChat, visible: (o) => true}
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
            ready: false,
            notifications: {},
            newestNotificationTimestamp: Math.floor(Date.now() / 1000) - 2,
            pingSuccessful: false,
            notificationsInterval: undefined,
            windowFocus: true
        }
    },
    computed: {
      showCertDialog() {return ! this.pingSuccessful}
    },
    async mounted() {
      this.pingSuccessful = (await Backend.ping()).success == true;
      if (this.pingSuccessful) {
        let register = await Backend.register("diam0ndkiller", "minecraft");
        console.log("register:", register);
        let login = await Backend.login("diam0ndkiller", "minecraft");
        console.log("login:", login);
        let chat = await Backend.getChatById(-1);
        chat = {...chat};
        this.o = chat.chat;
        if (this.notificationsInterval) clearInterval(this.notificationsInterval);
        this.notificationsInterval = setInterval(this.getNewNotifications, 1000);
        await NotificationAPI.request();
        window.onblur = () => {  
          this.windowFocus=false;
        }  
        window.onfocus = () => {  
          this.windowFocus=true;
        }
        this.ready = true;
      }
    },
    watch: {
    },
    methods: {
      navigation__chat__click(o) {
        let old_id = this.o.id;
        this.o = o;
        this.navigation__expanded = false;
        this.notifications[old_id] = {};
        this.notifications[this.o.id] = {};
      },
      navigation__expand__click() {
        this.navigation__expanded = true;
      },
      message__options__click(o) {
        this.messageOptions = o;
        this.showMessageOptions = true;
      },
      participant__options__click(o) {
        this.participantOptions = o;
        this.showParticipantOptions = true;
      },
      openChat(o) {
        this.navigation__chat__click(o)
      },
      async leaveChat(o) {

      },
      async getNewNotifications() {
        let data = await Backend.getNewNotifications(this.newestNotificationTimestamp);
        this.newestNotificationTimestamp = Math.floor(Date.now() / 1000) - 2;
        data.notifications.forEach(element => {
          if (!(element.chat_id in this.notifications)) this.notifications[element.chat_id] = {};

          let message_already_received = element.id in this.notifications[element.chat_id];
          let in_current_chat = element.chat_id == this.o.id;

          console.log("windowfocus: ", this.windowFocus)

          if (!message_already_received && (!in_current_chat || !this.windowFocus)) {
            NotificationAPI.sendNotification(element.chat_name, element.content, element.chat_image, element.chat_id);
          }

          this.notifications[element.chat_id][element.id] = element;
        });
      }
    }
}
</script>

<style scoped>
</style>
