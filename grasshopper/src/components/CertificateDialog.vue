<script setup>
import { Backend } from '@/scripts/backend'
const sslCertTitle = "grasshopper API - Accept SSL Certificate";
const sslCertText = "This service uses an SSL certificate to ensure a secure (https) connection "+
"to the server. But because I'm no big company, I have to sign the certificate myself. Because of that, your browser "+
"doesn't accept the certificate by default. Click this link to accept the certificate manually and to ensure a secure connection.\n"+
"Your browser will probably prompt you with the information that the site is insecure. You will want to click 'Advanced' and 'Accept'.";
const sslCertNote = "After you accept, please reload this page.";
const serverDownNote = "If you already accepted the certificate, the service might be down for maintenance. Sorry, please try again later!";
</script>

<template>

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
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        
    }
}
</script>

<style>

</style>