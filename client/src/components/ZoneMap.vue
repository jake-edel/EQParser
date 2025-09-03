<template>
  <div class="card flex-col items-center">
    <img
      :src="zoneMap"
      alt="map of zone"
      style="max-width: 100%;"
    />
    <component :is="currentZoneContent"></component>
  </div>
</template>

<script setup>
import OasisOfMarr from '../zones/OasisOfMarr.vue'
import EastCommonlands from '../zones/EastCommonlands.vue'
import NorthRo from '../zones/NorthRo.vue'
import useWebSocket from '../composables/useWebSocket'
import { ref, computed } from 'vue'

const zone = ref('')
useWebSocket([{zone: (newZone) => zone.value = newZone}])

const zoneId = computed(() => zone.value.replace(/ /g, '_').toLowerCase())
const zoneContent = {
  'oasis_of_marr': OasisOfMarr,
  'east_commonlands': EastCommonlands,
  'northern_desert_of_ro': NorthRo
}
const currentZoneContent = computed(() => zoneContent[zoneId.value])
const zoneMap = computed(() => `../../assets/maps/${zoneId.value}.jpg`)
</script>