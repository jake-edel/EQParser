<template>
  <div class="card" style="margin-bottom: 16px;">
    <div style="display: flex; gap: 8px;">
      <h2>Log</h2>
      <button @click="reverseLog">Reverse</button>
      <button @click="clearLog">Clear</button>
    </div>
    <div class="chat-container">
      <LogLine
        v-for="(message, index) in log"
        style="margin: 0;"
        :key="message + index"
        :message
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import LogLine from './LogLine.vue';

const log = ref([]);
const logIsReversed = ref(false);

const handleLogMessage = (message) => {
  logIsReversed.value ? log.value.unshift(message) : log.value.push(message);
}

useWebSocket([{ 'log': handleLogMessage }]);

const reverseLog = () => {
  log.value = log.value.slice().reverse();
  logIsReversed.value = !logIsReversed.value;
}

const clearLog = () => log.value.length = 0;
</script>