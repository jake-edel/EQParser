<template>
  <div class="card flex-col items-center">
    <img
      :src="zoneMap"
      alt="map of zone"
      style="max-width: 300px;"
    />
    <component :is="currentZoneContent"></component>
  </div>
</template>

<script setup>
import OasisOfMarr from '../zones/OasisOfMarr.vue'

const currentZone = 'oasis_of_marr'
const zoneMap = `../../assets/maps/${currentZone}.jpg`

const zoneContent = {
  'oasis_of_marr': OasisOfMarr
}
const currentZoneContent = zoneContent[currentZone]

</script>