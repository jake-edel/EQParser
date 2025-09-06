<template>
  <button
    type="button"
    class="flex items-center"
    style="width: min-content; background: none;"
    @click="$emit('cancelTimer', spell)"
  >
    <img :src="`../../assets/icons/${spell.icon}.png`" alt="spell icon"/>
    {{ spell.name }} {{ spell.timeRemaining }}
  </button>
</template>

<script setup>
defineProps({
  spell: {
    type: Object,
    required: true
  }
})
</script>