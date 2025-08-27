<template>
  <div class="card">
    <h2>Pet</h2>
    <div>
      Name: <span>{{ petName }}</span>
    </div>
    <div>
      Status: <span>{{ petStatus }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const petName = ref('');
const petStatus = ref('');

const socketListeners = [
  { 'petName': (message) => { petName.value = message; } },
  { 'petStatus': (message) => { petStatus.value = message; } }
];

useWebSocket(socketListeners);
</script>