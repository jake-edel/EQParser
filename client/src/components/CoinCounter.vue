<template>
  <div class="flex-col" style="align-items: end; gap: 0px">
    <div
      v-for="coin in coins"
      :key="coin"
      :id="`total-coin-${coin}`"
      class="flex items-center"
    >
      <div>{{ coinLoot.total[coin] }}</div>
      <div
        class="coin"
        :style="{ backgroundColor: `var(--color-${coin})` }"
      />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const coins = ['platinum', 'gold', 'silver', 'copper']

const coinLoot = ref({ total: {}, received: {}});

const socketListeners = [
  { 'coinLoot': (message) => { coinLoot.value = message; } }
];

useWebSocket(socketListeners);
</script>

<style scoped>
  .coin {
    height:12px;
    width: 12px;
    background-color: var(--color-platinum);
    border-radius: 50%;
    border: 1px solid #646464
  }
</style>
