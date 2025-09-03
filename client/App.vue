<template>
  <div id="header-container">
    <CharacterInfo />
    <Compass />
    <CoinCounter />
  </div>
  <div class="flex">
    <button
      v-for="component in components"
      :key="component"
      @click="activeComponent = component"
      :style="{
          backgroundColor: component === activeComponent ? 'blue' : 'white',
          width: '64px',
          height: '24px',
          borderRadius: '8px'
      }"
    >
      {{ component }}
    </button>
  </div>
  <SpellList v-show="activeComponent === 'spells'" />
  <ZoneMap v-show="activeComponent === 'zone'" />
  <ChatBox v-show="activeComponent === 'chat'" />
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from './src/composables/useWebSocket.js'
import CharacterInfo from './src/components/CharacterInfo.vue'
import Compass from './src/components/Compass.vue';
import CoinCounter from './src/components/CoinCounter.vue';
import SpellList from './src/components/SpellList.vue';
import ChatBox from './src/components/ChatBox.vue';
import ZoneMap from './src/components/ZoneMap.vue';

const components = ['spells', 'zone', 'chat']
const activeComponent = ref('chat')

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