<template>
    <div class="spotify" v-if="currentTrack">
        <div class="player">
            <div class="track-info">
                <div class="player-header">
                    <span>Maeve is currently</span>
                    <span>listening to</span>
                </div>
                <span class="song-title">{{ currentTrack.title }}</span>
                <span class="song-artist">{{ currentTrack.artist }}</span>
                <div class="controls">
                    <button v-wave="wave" @click="reset">
                        <ion-icon name="play-skip-back"></ion-icon>
                    </button>
                    <button v-wave="wave" @click="togglePlay">
                        <ion-icon :name="!isPaused ? 'pause' : 'play'"></ion-icon>
                    </button>
                    <div class="volume">
                        <button @click="mute" v-wave="wave">
                            <ion-icon :name="getVolumeIcon"></ion-icon>
                        </button>
                        <input type="range" name="volume" min="0" max="1" step="0.05" id="volume" v-model="volume">
                    </div>
                    <a target="_blank" v-wave="wave" :href="currentTrack.spotifyLink">
                        <SpotifyIcon />
                    </a>

                </div>
                <audio v-if="currentTrack.previewUrl" :src="currentTrack.previewUrl" ref="spotify"></audio>
            </div>
            <img :src="currentTrack.albumArt" alt="Album Art" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import SpotifyIcon from './SpotifyIcon.vue';

export default {
    components: {
        SpotifyIcon,
    },
    data() {
        return {
            currentTrack: null,
            spotify: null,
            isPaused: true,
            volume: 0.5,
            volumeBackup: 0.5,
            isMuted: false,
            wave: {
                duration: 0.2,
                color: '#AE6A7D',
                initialOpacity: 0.2,
                easing: 'ease-out'
            },
        };
    },
    methods: {
        togglePlay() {
            if (this.$refs.spotify.paused) {
                this.$refs.spotify.play();
                this.isPaused = false;
            } else {
                this.$refs.spotify.pause();
                this.isPaused = true;
            }
        },
        reset() {
            this.$refs.spotify.currentTime = 0;
        },

        mute() {
            if (this.isMuted) {
                this.volume = this.volumeBackup;
                this.isMuted = false;
            } else {
                this.volumeBackup = this.volume;
                this.volume = 0;
                this.isMuted = true;
            }
        },
        updateVolume() {
            this.$refs.spotify.volume = this.volume;
        },
        async fetchCurrentTrack() {
            try {
                const response = await axios.get('/api/spotify');
                if (response.data && response.data.item) {
                    const track = response.data.item;
                    this.currentTrack = {
                        title: track.name,
                        artist: track.artists.map((artist) => artist.name).join(', '),
                        albumArt: track.album.images[0].url,
                        previewUrl: track.preview_url,
                        spotifyLink: track.external_urls.spotify,
                    };
                } else {
                    this.currentTrack = null;
                }
            } catch (error) {
                console.error('Error fetching track:', error);
            }
        },
    },
    watch: {
        volume() {
            this.updateVolume();
            this.isMuted = this.volume === 0;
        },
    },
    computed: {
        // volumePercent() {
        //     return this.volume * 100;
        // },
        getVolumeIcon() {
            if (this.isMuted) {
                return 'volume-mute';
            }
            if (this.volume < 0.05) {
                return 'volume-off';
            }
            if (this.volume < 0.6) {
                return 'volume-low';
            }
            return 'volume-high';
        }
    },
    mounted() {
        // Fetch track data when the component is mounted
        this.fetchCurrentTrack();
        this.spotify = this.$refs.spotify;
        // Optionally: Set interval to refresh every 30 seconds or so
        setInterval(this.fetchCurrentTrack, 30000);
    },
};
</script>
