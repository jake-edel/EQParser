<template>
  <div class="flex-col items-center">
    <a :href="formatWikiLink()" target="_blank">{{ zone }}</a>
    <div class="compass-grid">
      <div
        v-for="direction in directions" :key="direction"
        :style="{
          color: `${currentDirection === direction.key ? 'green': 'white'}`,
          textAlign: 'center',
          border: `solid 1px ${currentDirection === direction.key ? 'green': 'white'}`,
          borderRadius: '50%',
          padding: '2px',
          margin: '2px'
        }"
      >
        {{ direction.label }}
      </div>
    </div>
    {{ location.x }} | {{ location.y }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';

const directions = [
  {key: 'northwest', label: 'NW'},
  {key: 'north', label: 'N'},
  {key: 'northeast', label: 'NE'},
  {key: 'west', label: 'W'},
  {key: '', label: ''},
  {key: 'east', label: 'E'},
  {key: 'southwest', label: 'SW'},
  {key: 'south', label: 'S'},
  {key: 'southeast', label: 'SE'}
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

const formatWikiLink = () => {
  const currentZone = zone.value.replace(' ', '_')
  return `https://wiki.project1999.com/${currentZone}`
}

</script>

<style scoped>
.compass-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>