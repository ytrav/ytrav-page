<script>
import axios from 'axios';

export default {
    data() {
        return {
            messages: []
        }
    },
    mounted() {
        this.fetchMessages();
    },
    methods: {
        async fetchMessages() {
            try {
                const response = await axios.get('/api/get-messages');
                if (response.data.success) {
                    this.messages = response.data.messages || [];
                }
            } catch (error) {
                console.error('Error fetching messages:', error.response ? error.response.data : error);
            }
        },
        getTimeSince(timestamp) {
            const seconds = Math.floor((new Date() - timestamp) / 1000);
            let interval = Math.floor(seconds / 31536000);

            if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";

            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";

            interval = Math.floor(seconds / 86400);
            if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";

            interval = Math.floor(seconds / 3600);
            if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

            interval = Math.floor(seconds / 60);
            if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

            return Math.floor(seconds) + " second" + (seconds > 1 ? "s" : "") + " ago";
        }
    }
}
</script>

<template>
    <div class="messages">
        <div class="wrapper">
            <h1>Messages</h1>

            <div class="messages">
                <div class="message" v-for="(message, index) in messages" :key="index">
                    <span class="time">{{ getTimeSince(message.timestamp) }}</span><span class="text">{{ message.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>