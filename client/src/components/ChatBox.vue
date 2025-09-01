<template>
  <div class="card" style="margin-bottom: 16px;">
    <div style="display: flex; gap: 8px;">
      <h2>{{ currentLog }}</h2>
      <button
        v-for="type in chatTypes"
        :key="type"
        type="button"
        @click="() => currentLog = type"
      >
        {{ type }}
      </button>
      <button @click="reverseLog">Reverse</button>
      <button @click="clearLog">Clear</button>
    </div>
    <div class="chat-container">
      <LogLine
        v-for="(message, index) in logs[currentLog]"
        style="margin: 0;"
        :key="message + index"
        :message
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import LogLine from './LogLine.vue';

const currentLog = ref('')

const chatTypes = ['debug', 'log', 'auction']

const logs = reactive({})
const logIsReversed = ref(false);

const handleLogMessage = (message) => {
  logIsReversed.value ? log.value.unshift(message) : log.value.push(message);
}

function handleChatMessage(type, message) {
  if (logs[type]) {
    logs[type].push(message)
  } else {
    logs[type] = [message]
  }
}

useWebSocket([
  { auction: (message) => handleChatMessage('auction', message) },
  { debug: (message) => handleChatMessage('debug', message) },
  { log: (message) => handleChatMessage('log', message) }
]);

const reverseLog = () => {
  log.value = log.value.slice().reverse();
  logIsReversed.value = !logIsReversed.value;
}

const clearLog = () => log.value.length = 0;
</script>