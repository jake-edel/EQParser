<template>
   <div v-if="isLoading" style="height: 100vh" class="flex items-center justify-center">
     <img src="./assets/icons/eqLogo.png" alt="everquest logo" class="bounce"/>
   </div>
  <div v-else>
    <div id="header-container">
      <CharacterInfo />
      <Compass />
      <CoinCounter />
    </div>
    <SpellList/>
    <div class="flex">
      <button
        v-for="component in components"
        :key="component"
        @click="activeComponent = component"
        :style="{
            backgroundColor: component === activeComponent ? 'green' : 'white',
            width: '64px',
            height: '24px',
            borderRadius: '8px'
        }"
      >
        {{ component }}
      </button>
    </div>
    <ZoneMap v-show="activeComponent === 'zone'" />
    <ChatBox v-show="activeComponent === 'chat'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useWebSocket from './src/composables/useWebSocket.js'
import CharacterInfo from './src/components/CharacterInfo.vue'
import Compass from './src/components/Compass.vue';
import CoinCounter from './src/components/CoinCounter.vue';
import SpellList from './src/components/SpellList.vue';
import ChatBox from './src/components/ChatBox.vue';
import ZoneMap from './src/components/ZoneMap.vue';

const components = ['zone', 'chat']
const activeComponent = ref('zone')

const { startWebSocketService, isLoading } = useWebSocket();
startWebSocketService();
</script>

<style scoped>
#header-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
</style>