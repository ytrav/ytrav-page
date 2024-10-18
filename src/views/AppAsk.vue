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
            <form>
                <div class="form-group">
                    
                </div>
                <div class="form-group
                ">
                    <label for="question">Message</label>
                    <textarea v-model="message" id="question"></textarea>
                </div>
                <button @click.prevent="sendMessage">Submit</button>
            </form>
        </div>
    </div>
</template>