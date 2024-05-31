<script setup>
import Navigation from './components/Navigation.vue'
import Content from './components/Content.vue'
</script>

<template>
  <nav class="navigation" v-bind:class="{hiddenWhenSmall: !navigation__expanded}">
    <Suspense>
      <Navigation v-bind:current_chat_id="o.id" @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click"/>
    </Suspense>
  </nav>
  
  <main class="content" v-bind:class="{hiddenWhenSmall: navigation__expanded}">
    <Content v-bind:o="o" @navigation-expanded-click="navigation__expand__click" @chat-options-click="chat__options__current__click"/>
  </main>

  <v-dialog v-model="showChatOptions">
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
</template>

<script>
export default {
    data() {
        return {
            navigation__expanded: true,
            o: {id: "-1", name: "welcome"},
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
            showParticipantOptions: false
        }
    },
    computed: {
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

      }
    }
}
</script>

<style scoped>
</style>
