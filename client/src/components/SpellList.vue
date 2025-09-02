<template>
  <div>
    <div>Spells</div>
    <div v-for="spell in activeSpells">{{ spell.name }} {{ spell.timeRemaining }}</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import useWebSocket from '../composables/useWebSocket';

let activeSpells = reactive([])

const timer = ref(0)
const clearSpell = (spell) => {
  activeSpells = reactive(activeSpells.filter(activeSpell => (
    activeSpell.instanceId === spell.id
  )))
}

function setSpellTimeout(spell) {
  timer.value = spell.duration * 60
  console.log('setting timeout for', timer.value, 'seconds for spell', spell.name)
  // spell.timeout = setTimeout(clearSpell, timer.value * 1000)
  spell.timeRemaining = ref(timer.value)
  spell.interval = setInterval(() => {
    spell.timeRemaining.value--
    if (spell.timeRemaining.value === 0) {
      clearSpell(spell)
      clearInterval(spell.interval)
    }
  }, 1000)
  activeSpells.push(spell)
}

function spellHandler(spell) {
  console.log('spell handler - handling spells since 2025')
  setSpellTimeout(spell)
}

useWebSocket([{ spellLanded: spellHandler }])

</script>