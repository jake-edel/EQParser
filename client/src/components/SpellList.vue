<template>
  <div class="flex-col">
    <div v-for="spell in activeSpells" class="flex items-center">
      <img :src="'../../assets/icons/eye.png'" alt="spell icon"/>
      {{ spell.name }} {{ spell.timeRemaining }}
    </div>
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
  spell.timeRemaining = ref(timer.value)
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
  activeSpells.push(spell)
}

useWebSocket([{ spellLanded: spellHandler }])

</script>