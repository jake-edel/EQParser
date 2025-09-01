<template>
  <div id="header-container">
    <CharacterInfo />
    <CoinCounter />
  </div>
  <LocationStatus />
  <PetStatus />
  <ChatBox :type="'debug'"/>
  <ChatBox :type="'log'"/>
  <ChatBox :type="'auction'"/>
</template>

<script setup>
import useWebSocket from './src/composables/useWebSocket.js'
import CharacterInfo from './src/components/CharacterInfo.vue'
import ChatBox from './src/components/ChatBox.vue';
import LocationStatus from './src/components/LocationStatus.vue';
import PetStatus from './src/components/PetStatus.vue';
import CoinCounter from './src/components/CoinCounter.vue';

const { startWebSocketService } = useWebSocket();
startWebSocketService();
</script>

<style scoped>
#header-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  height: 80px
}
</style>