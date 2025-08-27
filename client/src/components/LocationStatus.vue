<template>
  <div class="card">
    <h2>Location</h2>
    <div>
      Zone: {{ zone }}
    </div>
    <div>
      <span id="location">Y: {{ location.y }}, X: {{ location.x }}</span>
    </div>
    <div>
      Direction: {{ compassDirection }}
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import useWebSocket from '../composables/useWebSocket';

  const location = ref({ y: 0, x: 0 });
  const compassDirection = ref('');
  const zone = ref('');

  const handleCoordinates = (coordinates) => {
    const { y, x } = coordinates;
    location.value = { x, y };
  };

  useWebSocket([
    { 'location': handleCoordinates },
    { 'compassDirection': (message) => { compassDirection.value = message; } },
    { 'zone': (message) => { zone.value = message; } }
  ]);
</script>