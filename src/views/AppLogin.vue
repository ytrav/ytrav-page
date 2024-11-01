<script>
import axios from 'axios';
import { useVarStore } from '../stores/varStore';
import { mapStores } from 'pinia';

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  computed: {
    ...mapStores(useVarStore),
  },
  mounted() {
    // Clear the username and password fields when the component is mounted
    this.username = '';
    this.password = '';
    if (this.varStore.loggedIn) {
      // Redirect to /messages if the user is already logged in
      this.$router.push('/messages');
    } else {
      axios
        .get('/api/get-messages')
        .then(() => {
          this.varStore.setLoggedIn(true);
          this.varStore.callToast("You're already logged in", 'checkmark-done-outline');
          this.$router.push('/messages');
        })
    }
  },
  methods: {
    async login() {
      try {
        const credentials = btoa(`${this.username}:${this.password}`);
        const response = await axios.get('/api/get-messages', {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        });
        console.log('Messages:', response.data.messages);
        // Redirect to /messages after successful login
        this.$router.push('/messages');
      } catch (error) {
        console.error('Error fetching messages:', error.response ? error.response.data : error);
      }
    }
  }
}
</script>

<template>
  <div class="login">
    <div class="wrapper">
      <h1>Login</h1>

      <form>
        <div class="form-group">

        </div>
        <div class="form-group
                ">

          <input type="text" name="username" v-model="username" placeholder="Username" id="username">
          <input type="password" name="password" id="password" placeholder="Password" v-model="password">
        </div>
        <button v-wave="{
          duration: 0.2,
          color: 'currentColor',
          initialOpacity: 0.2,
          easing: 'ease-out'
        }" @click.prevent="login">Sign in</button>
      </form>
    </div>
  </div>
</template>