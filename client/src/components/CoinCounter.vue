<template>
  <div class="card">
    <h2>Coins</h2>
    <div>
      <div id="coin-platinum">Platinum: {{ coinLoot.received.platinum }}</div>
      <div id="coin-gold">Gold: {{ coinLoot.received.gold }}</div>
      <div id="coin-silver">Silver: {{ coinLoot.received.silver }}</div>
      <div id="coin-copper">Copper: {{ coinLoot.received.copper }}</div>
      <div id="total-coin-platinum">platinum: {{ coinLoot.total.platinum }}</div>
      <div id="total-coin-gold">gold: {{ coinLoot.total.gold }}</div>
      <div id="total-coin-silver">silver: {{ coinLoot.total.silver }}</div>
      <div id="total-coin-copper">copper: {{ coinLoot.total.copper }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const coinLoot = ref({ total: {}, received: {}});

const socketListeners = [
  { 'coinLoot': (message) => { coinLoot.value = message; } }
];

useWebSocket(socketListeners);
</script>