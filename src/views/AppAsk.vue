<script>
import axios from 'axios';
import { useVarStore } from '../stores/varStore';
import { mapStores } from 'pinia';

export default {
    data() {
        return {
            message: '',
            successMessage: '',
            textboxDisabled: false,
            maxLength: 140,
        }
    },
    computed: {
        ...mapStores(useVarStore),
        disableSend() {
            if (this.message === '' || this.message.length > this.maxLength) {
                return true;
            } else {
                return false;
            }
        },
        length() {
            return this.message.length;
        }
    },
    methods: {
        async sendMessage() {
            if (!this.disableSend) {
                this.textboxDisabled = true;
                try {
                    const response = await axios.post('/api/send-message', {
                        message: this.message
                    });
                    if (response.data.success) {
                       this.varStore.callToast('Message sent successfully', 'checkmark-done-outline');
                        this.message = '';
                    }
                } catch (error) {
                    console.error('Failed to send message:', error);
                    this.varStore.callToast('Failed to send message, please try again later', 'close-circle-outline');
                }
                this.textboxDisabled = false;
            }
        }
    }
}
</script>

<template>
    <div class="ask">
        <div class="wrapper">
            <h2>Send me a message</h2>
            <p>Here you can send me a completely anonymous message, ask a question, share gossip, anything, free of
                charge^^</p>
            <p>I will reply to messages from time to time on my twitter</p>
            <span class="counter" :class="{ warn: length > maxLength - 40, stop: length >= maxLength }">{{ length
                }}/{{ maxLength }}</span>
            <form>
                <textarea :class="{ disabled: textboxDisabled }" :disabled="textboxDisabled" v-model="message"
                    spellcheck="false" id="question" placeholder="Enter your wonderful message..."
                    autocomplete="off"></textarea>

                <button :class="{ disabled: disableSend }" :disabled="disableSend" v-wave="{
                    duration: 0.2,
                    color: 'currentColor',
                    initialOpacity: 0.2,
                    easing: 'ease-out'
                }" @click.prevent="sendMessage">Send!</button>
            </form>
        </div>
    </div>
</template>