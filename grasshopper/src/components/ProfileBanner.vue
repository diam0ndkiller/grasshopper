<script setup>
import { Backend } from '@/scripts/backend';
</script>

<template>
<div class="profile_banner" v-if="user != undefined">
    <div class="profile_icon">
        <img class="profile_icon" :src="user.image"/>
    </div>
    <div class="profile_name">
        <h3 class="profile_name">{{ user.name }}</h3>
    </div>
    <div class="profile_options">
        <v-btn icon="mdi-dots-vertical" @click="() => {showUserOptions = true}" />
    </div>
</div>
<v-dialog v-model="showUserOptions">
    <v-card title="User Options" prepend-icon="mdi-account-edit">
        <v-card-item title="Update User Image">
            <v-form @submit.prevent="updateUserImage">
                <v-file-input color="primary-light" id="updateUserImage" clearable label="New User Image"></v-file-input>
                <v-btn type="submit" prepend-icon="mdi-upload" color="primary">Update</v-btn>
                <span style="color: #c00">{{ updateImageError }}</span>
                <span style="color: #0c0">{{ updateImageSuccess }}</span>
            </v-form>
        </v-card-item>
        <v-card-item></v-card-item>
        <v-card-item title="Change User Name">
            <v-form @submit.prevent="updateUserName">
                <v-text-field color="primary-light" v-model="newUserName" clearable label="New User Name"></v-text-field>
                <v-btn type="submit" prepend-icon="mdi-content-save" color="primary">Save</v-btn>
                <span style="color: #c00">{{ updateNameError }}</span>
                <span style="color: #0c0">{{ updateNameSuccess }}</span>
            </v-form>
        </v-card-item>
        <v-card-item></v-card-item>
        <v-card-item title="More Actions">
            <span style="margin-right: 5px">
                <v-btn prepend-icon="mdi-information" color="primary" @click="() => {showAboutPage = true}">About</v-btn>
            </span>
            <span style="margin-left: 5px">
                <v-btn prepend-icon="mdi-cog" color="primary" @click="() => {showAppSettings = true}">App Settings</v-btn>
            </span>
        </v-card-item>
    </v-card>
</v-dialog>

<v-dialog v-model="showAboutPage">
    <v-card title="About" text="Credits and Information about components of this app" prepend-icon="mdi-information">
        <v-card-item title="grasshopper">
Grasshopper is an app developed by diam0ndkiller. It was created during an internship. <br>
License: <a href="https://opensource.org/license/bsd-2-clause">BSD-2 Clause</a><br>
Source: <a href="https://github.com/diam0ndkiller/grasshopper">GitHub</a>
        </v-card-item>
        <v-card-item title="VuetifyJS">
The app is based on a JavaScript framework called <a href="https://vuejs.org">VueJS</a>.<br>
License: <a href="https://opensource.org/license/mit">MIT</a><br>
Source: <a href="https://github.com/vuejs/core">GitHub</a>
        </v-card-item>
        <v-card-item title="VuetifyJS">
Many design objects are from a library called <a href="https://vuetifyjs.com">Vuetify</a>.<br>
License: <a href="https://opensource.org/license/mit">MIT</a><br>
Source: <a href="https://github.com/vuetifyjs/vuetify">GitHub</a>
        </v-card-item>
        <v-card-item title="vue3-emoji-picker">
The Emoji Picker is an open-source project by delowardev.<br>
License: <a href="https://opensource.org/license/mit">MIT</a><br>
Source: <a href="https://github.com/delowardev/vue3-emoji-picker">GitHub</a>
        </v-card-item>
        <v-card-item></v-card-item>
    </v-card>
</v-dialog>

<v-dialog v-model="showAppSettings">
    <v-card title="App Settings" prepend-icon="mdi-cog">
        <v-form @submit.prevent="saveIntervals">
            <v-card-item title="Interval for checking for notifications:">
                <v-slider v-model="notificationsInterval" :max="30000" :min="500" :step="500" :label="notificationsInterval+' ms'" color="primary"/>
            </v-card-item>
            <v-card-item title="Interval for checking for edited / deleted messages and reaction updates in the current chat:">
                <v-slider v-model="editedMessagesInterval" :max="30000" :min="500" :step="500" :label="editedMessagesInterval+' ms'" color="primary"/>
            </v-card-item>
            <v-card-item>
                <span style="margin: 5px">
                    <v-btn type="submit" prepend-icon="mdi-content-save" color="primary">Save</v-btn>
                </span>
            </v-card-item>
        </v-form>
        <v-card-item title="Please reload your page after saving to use the new intervals.">
            You can find these values in your browser's local storage.
        </v-card-item>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    data() {
        return {
            user: undefined,
            updateImageError: '',
            updateImageSuccess: '',
            updateNameError: '',
            updateNameSuccess: '',
            newUserName: '',
            showUserOptions: false,
            showAboutPage: false,
            showAppSettings: false,
            notificationsInterval: localStorage.getItem('notificationsInterval') || 1000,
            editedMessagesInterval: localStorage.getItem('editedMessagesInterval') || 5000
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    methods: {
        async updateUserImage() {
            let image;
            const file = document.querySelector("#updateUserImage").files[0];

            if (!file) {
                this.updateImageSuccess = '';
                this.updateImageError = "No file selected.";
                return;
            }

            const reader = new FileReader();

            reader.onloadend = async (e) => {
                image = e.target.result;
                console.log(image);
                try {
                    let result = await Backend.updateUserImage(image);
                    if (result.success) {
                        this.updateImageError = '';
                        this.updateImageSuccess = 'Image successfully updated.';
                    } else {
                        this.updateImageError = result.message;
                        this.updateImageSuccess = '';
                    }
                } catch (error) {
                    console.error("Failed to upload image:", error);
                }
            }

            reader.onerror = (error) => {
                console.error("Failed to read file:", error);
            };

            reader.readAsDataURL(file);
        },
        async updateUserName() {
            if (! this.newUserName) {
                this.updateNameError = "No Username Provided.";
                this.updateNameSuccess = "";
                return;
            }

            let result = await Backend.changeUsername(this.newUserName);

            if (result.success) {
                this.updateNameError = '';
                this.updateNameSuccess = 'Username successfully updated.';
            } else {
                this.updateNameError = result.message;
                this.updateNameSuccess = '';
            }
        },
        saveIntervals() {
            localStorage.setItem('notificationsInterval', this.notificationsInterval);
            localStorage.setItem('editedMessagesInterval', this.editedMessagesInterval);
        }
    },
    async mounted() {
        this.user = (await Backend.getUserById(Backend.user_id)).user;
        this.newUserName = this.user.name;
    }
}
</script>

<style>
div.profile_banner {
    display: grid;
    position: fixed;
    bottom: 0;
    grid-template-columns: 58px 1fr 58px;
    background-color: #222222;
}

div.profile_icon {
    padding: 5px;
    display: flex;
    margin: auto;
}

img.profile_icon {
    width: 48px;
    height: 48px;
}

div.profile_name {
    padding: 5px;
    display: flex;
    margin: auto;
}

div.profile_options {
    padding: 5px;
    display: flex;
    margin: auto;
}

@media (max-width: 1199px) {
    div.profile_banner {
        width: 100vw;
    }
}

@media (min-width: 1200px) {
    div.profile_banner {
        width: 20vw;
    }
}
</style>