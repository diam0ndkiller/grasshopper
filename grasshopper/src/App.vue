<script setup>
import Navigation from './components/Navigation.vue';
import Content from './components/Content.vue';
import CertificateDialog from './components/CertificateDialog.vue';
import { Backend } from './scripts/backend';
import { NotificationAPI } from './scripts/notificationAPI';
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
    <CertificateDialog/>
  </v-dialog>

  <v-dialog v-if="pingSuccessful" v-model="showLoginDialog">
    <v-card
      title="Login / Register"
      text="Enter Username to Login or Register."
      prepend-icon="mdi-lock"
      >
      <v-form @submit.prevent="">
        <v-card-item>
          <v-text-field v-model="username" color="primary-light" label="Username" type="text" />
          <v-text-field v-model="password" color="primary-light" label="Password" type="password" />
          <span style="margin-right: 5px">
            <v-btn type="submit" prepend-icon="mdi-login" color="primary" @click="login">Login</v-btn>
          </span>
          <span style="margin-left: 5px">
            <v-btn prepend-icon="mdi-login-variant" color="primary" @click="register">Register</v-btn>
          </span>
          <span style="color: #c00">{{ loginError }}</span>
          <span style="color: #0c0">{{ loginSuccess }}</span>
        </v-card-item>
      </v-form>
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
              {icon: "mdi-exit-run", text: "Leave", color: "#c00", action: this.leaveChat, visible: (o) => (o.id >= 0)},
              {icon: "mdi-arrow-right-circle-outline", text: "Open", color: "#0c0", action: this.openChat, visible: (o) => true}
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
            notifications: {},
            newestNotificationTimestamp: Math.floor(Date.now() / 1000) - 2,
            pingSuccessful: false,
            notificationsInterval: localStorage.getItem('notificationsInterval') || 1000,
            windowFocus: true,
            showLoginDialog: true,
            username: '',
            password: '',
            logged_in: false,
            loginError: '',
            loginSuccess: ''
        }
    },
    computed: {
      showCertDialog() {return ! this.pingSuccessful},
      ready() {return this.pingSuccessful && this.logged_in}
    },
    async mounted() {
      this.pingSuccessful = (await Backend.ping()).success == true;
      this.init_focus_listeners();
    },
    watch: {
    },
    methods: {
      async login() {
        let result = await Backend.login(this.username, this.password);
        if (result.success) {
          this.loginSuccess = "Successfully logged in.";
          await this.load_chat();
          await this.init_notifications();
          this.logged_in = true;
          this.showLoginDialog = false;
        } else {
          this.loginError = "Error logging in: " + result.message;
        }
      },
      async register() {
        let result = await Backend.register(this.username, this.password);
        if (result.success) {
          this.loginSuccess = "Successfully registered.";
          await this.login();
        } else {
          this.loginError = "Error registering: " + result.message;
        }
      },
      async load_chat() {
        let chat = await Backend.getChatById(-1);
        chat = {...chat};
        this.o = chat.chat;
      },
      init_focus_listeners() {
        window.onblur = () => {  
          this.windowFocus=false;
        }  
        window.onfocus = () => {  
          this.windowFocus=true;
        }
      },
      async init_notifications() {
        if (this.notificationsInterval) clearInterval(this.notificationsInterval);
        setInterval(this.getNewNotifications, this.notificationsInterval);
        await NotificationAPI.request();
      },
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
