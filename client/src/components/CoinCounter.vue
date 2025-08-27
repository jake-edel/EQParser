<template>
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
</template>

<script>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const coinLoot = ref({ total: {}, received: {} });

const socketListeners = [
  { 'coinLoot': (message) => { coinLoot.value = message; } }
];

useWebSocket(socketListeners);
</script>