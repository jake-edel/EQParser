<template>
  <button
    type="button"
    class="flex items-center"
    style="width: fit-content; background: none; color: white;"
    @click="$emit('cancelTimer', spell)"
  >
    <img :src="`../../assets/icons/${spell.icon}.png`" alt="spell icon"/>
    <div class="flex-col">
      <div>
        {{ spell.name }}
      </div>
      <div>
        {{ timer }}
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  spell: {
    type: Object,
    required: true
  }
})

const timer = computed(() => {
  const mins = (props.spell.timeRemaining / 60).toFixed()
  const seconds = props.spell.timeRemaining % 60
  return `${mins}:${seconds <= 9 ? '0' : ''}${seconds}`
})
</script>