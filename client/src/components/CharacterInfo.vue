<template>
  <div class="flex-col">
    <span>{{ playerInfo.charName }}</span>
    <span>{{ playerInfo.level }}</span>
    <span>{{ playerInfo.race }}</span>
    <span>{{ playerInfo.charClass }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useWebSocket from '../composables/useWebSocket.ts';
import type { SocketHandler, PlayerInfo } from '../types/WebSocket.ts';

let playerInfo = ref<PlayerInfo>({
  charName: '',
  level: 1,
  race: '',
  charClass: ''
})
const isLoading = ref(true)

const handlePlayerInfo: SocketHandler = (payload) => {
  if ("charName" in payload) {
    playerInfo.value = payload
    isLoading.value = false
  }
}

const socketListeners = [{ playerCharacter: handlePlayerInfo }]

useWebSocket(socketListeners)
</script>