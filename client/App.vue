<template>
  <div id="header-container">
    <CharacterInfo />
    <Compass />
    <CoinCounter />
  </div>
  <ChatBox />

</template>

<script setup>
import useWebSocket from './src/composables/useWebSocket.js'
import CharacterInfo from './src/components/CharacterInfo.vue'
import ChatBox from './src/components/ChatBox.vue';
import PetStatus from './src/components/PetStatus.vue';
import CoinCounter from './src/components/CoinCounter.vue';
import Compass from './src/components/Compass.vue';

const { startWebSocketService } = useWebSocket();
startWebSocketService();
</script>

<style scoped>
#header-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
</style>