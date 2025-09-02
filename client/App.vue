<template>
  <div id="header-container">
    <CharacterInfo />
    <Compass />
    <CoinCounter />
  </div>
  <SpellList />
  <ChatBox />

</template>

<script setup>
import useWebSocket from './src/composables/useWebSocket.js'
import CharacterInfo from './src/components/CharacterInfo.vue'
import Compass from './src/components/Compass.vue';
import CoinCounter from './src/components/CoinCounter.vue';
import SpellList from './src/components/SpellList.vue';
import ChatBox from './src/components/ChatBox.vue';

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