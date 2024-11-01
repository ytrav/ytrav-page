<script>
import axios from 'axios';

export default {
    data() {
        return {
            messages: null
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
                    let arr = response.data.messages || [];
                    this.messages = Object.fromEntries(Object.entries(arr).reverse());;


                    // console.log('type:', typeof this.messages);

                    // console.log('Messages:', this.messages);

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
        },
    }
}
</script>

<template>
    <div class="messages">
        <div class="wrapper">
            <h1>Messages</h1>

            <div v-if="messages !== null" class="messages-list">
                <TransitionGroup name="load-in" appear>
                    <div class="message" v-for="(message, index) in Object.values(messages)" :key="index" :style="{
                        transitionDelay: `${index * 0.1}s`
                    }">
                        <span class="time">{{ getTimeSince(message.timestamp) }}</span><span class="text">{{
                            message.message
                            }}</span>
                    </div>
                </TransitionGroup>
                <div class="footer">
                    <span>-- And then the messages ended --</span>
                </div>
            </div>
            <div v-else class="loader-wrapper">
                <span class="loader"></span>
            </div>
        </div>
    </div>
</template>