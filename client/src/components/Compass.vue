<template>
  <div class="flex-col items-center">
    <p style="text-align: center; margin: 0; font-size: x-small">N</p>
    <div class="compass-grid">
      <div v-for="direction, index in directions" :key="direction">
        <div v-if="index === 4" />
        <div v-else class="flex items-center" :style="{
          color: `${currentDirection === direction.key ? 'green' : 'white'}`,
          rotate: `${direction.rotation}deg`,
          height: '10px',
          width: '10px',
          padding: '2px',
          margin: '2px'
        }">
          <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet">
            <polygon points="50,0 100,100 0,100" :fill="currentDirection === direction.key ? 'green' : 'white'"
              stroke="black" stroke-width="1" />
          </svg>
        </div>
      </div>
    </div>
    <div style="font-size: small;">
      X: {{ location.x }} | Y: {{ location.y }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const directions = [
  { key: 'northwest', rotation: 315 },
  { key: 'north', rotation: 0 },
  { key: 'northeast', rotation: 45 },
  { key: 'west', rotation: 270 },
  {},
  { key: 'east', rotation: 90 },
  { key: 'southwest', rotation: 225 },
  { key: 'south', rotation: 180 },
  { key: 'southeast', rotation: 135 }
]

const currentDirection = ref('')
const location = ref({ y: 0, x: 0 });
const zone = ref('');

const handleCoordinates = (coordinates) => {
  const { y, x } = coordinates;
  location.value = { x, y };
};

const socketHandlers = [
  { location: handleCoordinates },
  { zone: (newZone) => { zone.value = newZone; } },
  { compassDirection: (direction) => { currentDirection.value = direction.toLowerCase() } }
]

useWebSocket(socketHandlers)
</script>

<style scoped>
.compass-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>