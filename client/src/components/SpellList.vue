<template>
  <div class="flex" style="margin-bottom: 8px;">
    <SpellTimer v-for="spell in activeSpells" :spell @cancelTimer="clearSpell" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useWebSocket from '../composables/useWebSocket';
import SpellTimer from './SpellTimer.vue';

let activeSpells = ref([])

onMounted(() => {
  setInterval(() => {
    activeSpells.value.forEach(spell => {
      spell.timeRemaining--
      if (spell.timeRemaining <= 0) clearSpell(spell)
    })
  }, 1000);
})

const clearSpell = (spell) => {
  activeSpells.value = activeSpells.value.filter(activeSpell => (
    activeSpell.id !== spell.id
  ))
}

const hasExistingSpell = (spell) => !!(activeSpells.value.find(activeSpell => activeSpell.id == spell.id)) 

function spellHandler(spell) {
  const timer = spell.duration * 60
  spell.timeRemaining = ref(timer)
  if (hasExistingSpell(spell)) clearSpell(spell)
  activeSpells.value.push(spell)
}

useWebSocket([{ spellLanded: spellHandler }])
</script>