<template>
  <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
    <LocationStatus />
    <PetStatus />
    <CoinCounter />
  </div>
  <ChatBox :type="'debug'"/>
  <ChatBox :type="'log'"/>
</template>

<script setup>
import useWebSocket from './src/composables/useWebSocket.js'
import ChatBox from './src/components/ChatBox.vue';
import LocationStatus from './src/components/LocationStatus.vue';
import PetStatus from './src/components/PetStatus.vue';
import CoinCounter from './src/components/CoinCounter.vue';

const { startWebSocketService } = useWebSocket();
startWebSocketService();
</script>