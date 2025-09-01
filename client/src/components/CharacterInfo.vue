<template>
  <div v-if="isLoading">LOADING...</div>
  <div v-else class="flex-col">
    <span>{{ playerInfo.charName }}</span>
    <span>{{ playerInfo.level }}</span>
    <span>{{ playerInfo.race }}</span>
    <span>{{ playerInfo.charClass }}</span>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import useWebSocket from '../composables/useWebSocket';

let playerInfo = {}
const isLoading = ref(true)

const handlePlayerInfo = (message) => {
  playerInfo = reactive(message)
  isLoading.value = false
}

const socketListeners = [{ playerCharacter: handlePlayerInfo }]

useWebSocket(socketListeners)
</script>