<script>
import axios from 'axios';

export default {
    data() {
        return {
            message: '',
            successMessage: '',
        }
    },
    methods: {
        async sendMessage() {
            try {
                const response = await axios.post('/api/send-message', {
                    message: this.message
                });
                if (response.data.success) {
                    this.successMessage = 'Message sent successfully';
                    this.message = '';
                }
            } catch (error) {
                console.error('Failed to send message:', error);
                this.successMessage = 'Failed to send message';
            }
        }
    }
}
</script>

<template>
    <div class="ask">
        <div class="wrapper">
            <h1>Send me a message</h1>
            <p>Here you can send me a completely anonymous message, ask a question, share gossip, anything, free of charge^^</p>
            <p>I will reply to messages from time to time on my twitter</p>
            <form>
                <div class="form-group">
                    
                </div>
                <div class="form-group
                ">
                    
                    <textarea v-model="message" id="question" placeholder="Enter your wonderful message..." autocomplete="off"></textarea>
                </div>
                <button v-wave="{
                    duration: 0.2,
                    color: 'currentColor',
                    initialOpacity: 0.2,
                    easing: 'ease-out'
                }" @click.prevent="sendMessage">Send!</button>
            </form>
        </div>
    </div>
</template>