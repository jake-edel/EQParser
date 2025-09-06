<template>
  <div class="flex-col">
    <SpellTimer v-for="spell in activeSpells" :spell @cancelTimer="clearSpell" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import SpellTimer from './SpellTimer.vue';

let activeSpells = ref([])

const clearSpell = (spell) => {
  clearInterval(spell.intervalId)
  activeSpells.value = activeSpells.value.filter(activeSpell => (
    activeSpell.instanceId !== spell.instanceId
  ))
}

function setSpellTimeout(spell) {
  const timer = spell.duration * 60
  console.log('setting timeout for', timer, 'seconds for spell', spell.name)
  spell.timeRemaining = ref(timer)
  spell.intervalId = setInterval(() => {
    spell.timeRemaining.value--
    if (spell.timeRemaining.value <= 0) {
      clearSpell(spell)
      clearInterval(spell.intervalId)
    }
  }, 1000)
}

function spellHandler(spell) {
  setSpellTimeout(spell)
  activeSpells.value.push(spell)
}

useWebSocket([{ spellLanded: spellHandler }])

</script>