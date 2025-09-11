<template>
  <div class="flex-col" style="align-items: end; gap: 4px">
    <div
      v-for="coin in coins"
      :key="coin"
      :id="`coin-${coin}`"
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

<script setup lang="ts">
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import type { Coin, CoinLoot, Listener, SocketHandler } from '../types/WebSocket';

const coins: Array<Coin> = ['platinum', 'gold', 'silver', 'copper']

const initialCoinCount = {
  total: {
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0
  },
  received: { 
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0
  }
}

const coinLoot = ref<CoinLoot>(initialCoinCount);

const handler: SocketHandler = (payload) => {
  if ('total' in payload && 'received' in payload) coinLoot.value = payload;
}

const socketListeners: Listener[] = [
  { coinLoot: handler }
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

  #coin-platinum {
    color: var(--color-platinum);
  }

  #coin-gold {
    color: var(--color-gold);
  }

  #coin-silver {
    color: var(--color-silver);
  }

  #coin-copper {
    color: var(--color-copper);
  }
</style>
