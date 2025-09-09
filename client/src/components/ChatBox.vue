<template>
  <div class="card" style="margin-bottom: 16px;">
    <div style="display: flex; gap: 8px;">
      <button
        v-for="type in chatTypes"
        :key="type"
        type="button"
        :style="{
          backgroundColor: type === currentChat ? 'blue' : 'white',
          width: '64px',
          height: '24px',
          borderRadius: '8px'
          }"
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

const chatTypes = ['debug', 'log', 'auction', 'group', 'tell']

const chats = reactive({})
const currentChat = ref('log')
const chatIsReversed = ref(false);

function handleChatMessage(type, message) {
  if (chats[type]) {
    chatIsReversed.value 
      ? chats[type].unshift(message) 
      : chats[type].push(message);
  } else {
    chats[type] = [message]
  }
}

const socketListeners = chatTypes.map((type) => ({
  [type]: (message) => handleChatMessage(type, message)
}))

useWebSocket(socketListeners);

const reverseLog = () => {
  chats[currentChat] = chats[currentChat].slice().reverse();
  chatIsReversed.value = !chatIsReversed.value;
}

const clearLog = () => chats[currentChat].length = 0;
</script>