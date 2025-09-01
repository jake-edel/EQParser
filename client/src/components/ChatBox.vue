<template>
  <div class="card" style="margin-bottom: 16px;">
    <div style="display: flex; gap: 8px;">
      <h2>{{ currentChat }}</h2>
      <button
        v-for="type in chatTypes"
        :key="type"
        type="button"
        @click="() => currentChat = type"
      >
        {{ type }}
      </button>
      <button @click="reverseLog">Reverse</button>
      <button @click="clearLog">Clear</button>
    </div>
    <div class="chat-container">
      <LogLine
        v-for="(message, index) in chats[currentChat]"
        style="margin: 0;"
        :key="uuid()"
        :message
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import LogLine from './LogLine.vue';

const uuid = () => crypto.randomUUID()
const chatTypes = ['debug', 'log', 'auction']
const currentChat = ref('')
const chats = reactive({})
const chatIsReversed = ref(false);

function handleChatMessage(type, message) {
  if (chats[type]) {
    chatIsReversed.value 
      ? chats[currentChat].value.unshift(message) 
      : chats[currentChat].value.push(message);
  } else {
    chats[type] = [message]
  }
}

const socketListeners = chatTypes.map((type) => ({
  type: (message) => handleChatMessage(type, message)
}))

useWebSocket(socketListeners);

const reverseLog = () => {
  chats[currentChat].value = chats[currentChat].value.slice().reverse();
  chatIsReversed.value = !chatIsReversed.value;
}

const clearLog = () => chats[currentChat].value.length = 0;
</script>