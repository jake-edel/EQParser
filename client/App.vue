<template>
  <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
    <div class="card">
      <h2>Location</h2>
      <div>
        Zone: <span id="zone">{{ zone }}</span>
      </div>
      <div>
        <span id="location">Y: {{ location.y }}, X: {{ location.x }}</span>
      </div>
      <div>
        Direction: <span id="compassDirection">{{ compassDirection }}</span>
      </div>
    </div>
    <div class="card">
      <h2>Pet</h2>
      <div>
        Name: <span>{{ petName }}</span>
      </div>
      <div>
        Status: <span>{{ petStatus }}</span>
      </div>
    </div>
    <div class="card">
      <h2>Coins</h2>
      <div>
        <div id="coin-platinum">Platinum: 0</div>
        <div id="coin-gold">Gold: 0</div>
        <div id="coin-silver">Silver: 0</div>
        <div id="coin-copper">Copper: 0</div>
        <div id="total-coin-platinum">platinum: 0</div>
        <div id="total-coin-gold">gold: 0</div>
        <div id="total-coin-silver">silver: 0</div>
        <div id="total-coin-copper">copper: 0</div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom: 16px;">
    <h2>Debug</h2>
    <div class="chat-container">
      <LogLine
        v-for="(message, index) in debugMessages"
        style="margin: 0;"
        :key="message + index"
        :message="message"
      />
    </div>
  </div>
  <ChatBox />
</template>

<script setup>
import useWebSocket from './src/composables/useWebSocket.js'
import { ref } from 'vue';
import ChatBox from './src/components/ChatBox.vue';
import LogLine from './src/components/LogLine.vue';

const location = ref({ y: 0, x: 0 });
const compassDirection = ref('');
const petName = ref('');
const petStatus = ref('');
const zone = ref('');
const debugMessages = ref([]);
const coinLoot = ref({ total: {}, received: {} });

const handleCoordinates = (coordinates) => {
  const { y, x } = coordinates;
  location.value = { x, y };
}

const socketListeners = [
  { 'compassDirection': (message) => { compassDirection.value = message; } },
  { 'location': handleCoordinates },
  { 'zone': (message) => { zone.value = message; } },
  { 'debug': (message) => { debugMessages.value.push(message); } },
  { 'petName': (message) => { petName.value = message; } },
  { 'petStatus': (message) => { petStatus.value = message; } },
  { 'coinLoot': (message) => { coinLoot.value = message; } }
];

const { startWebSocketService } = useWebSocket(socketListeners);
startWebSocketService();
</script>