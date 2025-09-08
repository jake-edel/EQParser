<template>
  <div class="flex-col items-center">
    <a :href="`https://wiki.project1999.com/${zoneId}`" target="_blank">{{ zone }}</a>
    <img
      :src="zoneMap"
      alt="map of zone"
      style="max-width: 100%;"
    />
    <div v-html="zoneData" />
  </div>
</template>

<script setup>
import useWebSocket from '../composables/useWebSocket'
import { ref, computed } from 'vue'

const zone = ref('')
const zoneData = ref('')
const zoneId = computed(() => zone.value.replace(/ /g, '_').toLowerCase())
const zoneMap = computed(() => `../../assets/maps/${zoneId.value}.jpg`)

const handleZoneChange = async (newZone) => {
  if (!newZone) return
  zone.value = newZone
  zoneData.value = (await import(`../zones/${zoneId.value}.html?raw`)).default
}

useWebSocket([{zone: handleZoneChange}])
</script>