<script>
import { useVarStore } from '../stores/varStore';
import { mapStores } from 'pinia';

export default {
    computed: {
        ...mapStores(useVarStore),
        toast() {
            return this.varStore.toast
        }
    }
}

</script>

<template>
    <div class="toast">
        <ion-icon :name="toast.icon"></ion-icon>
        <p>{{ toast.message }}</p>
        <button class="close" v-wave="{
            duration: 0.2,
            color: '#AE6A7D',
            initialOpacity: 0.2,
            easing: 'ease-out'
        }" @click="varStore.hideToast">
            <ion-icon name="close-outline" />
        </button>
    </div>
</template>