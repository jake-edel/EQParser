import playerCharacter from "../parser/PlayerCharacter.ts"
import type { DurationRange } from "../types/types.d.ts"

const characterLevel = playerCharacter.info().level

function calculateDurationRange(range: DurationRange): number {
  const [minLevel, maxLevel] = range
  if (characterLevel < minLevel.level) return 0
  if (characterLevel >= maxLevel.level) return maxLevel.duration
  if (characterLevel === minLevel.level) return minLevel.duration
  const minutesPerLevel = maxLevel.duration / maxLevel.level
  return parseInt((characterLevel * minutesPerLevel).toFixed(2))
}

export const defaultSpell = {
    name: '',
    id: '',
    type: '',
    duration: 0,
    onSpellLand: '',
    onWearOff: '',
    instanceId: ''
  }

export const spells = {
  malignant_dead: {
    name: 'Malignant Dead',
    id: 'malignant_dead',
    onSpellLand: 'At your service master',
    castTime: 14,
    type: 'pet',
    icon: 'lich'
  },
  spirit_of_wolf: {
    name: 'Spirit of Wolf',
    id: 'spirit_of_wolf',
    castTime: 0,
    onSpellLand: 'You feel the spirit of wolf enter you.',
    type: 'buff',
    duration: 40,
    icon: 'boot'
  },
  deadeye: {
    name: 'Deadeye',
    id: 'deadeye',
    onSpellLand: 'Your vision shifts.',
    type: 'buff',
    duration: 24,
    icon: 'eye'
  },
  shadow_sight: {
    name: 'Shadow Sight',
    id: 'shadow_sight',
    onSpellLand: 'The shadows fade.',
    onWearOff: 'Your shadow sight fades.',
    type: 'buff',
    duration: 27,
    icon: 'eye'
  },
  gather_shadows: {
    name: 'Gather Shadows',
    id: 'gather_shadows',
    onSpellLand: 'You gather shadows about you.',
    castTime: 5,
    wearOff: 'Your shadows fade',
    type: 'buff',
    duration: 20,
    icon: 'eye'
    
  },
  augment_death: {
    name: 'Augment Death',
    id: 'augment_death',
    onSpellLand: 'gleam with madness',
    duration: calculateDurationRange([
      {
        level: 39,
        duration: 12.7
      },
      {
        level: 47,
        duration: 15
      }
    ]),
    icon: 'lich'
  },
  panic_the_dead: {
    name: 'Panic the dead',
    id: 'panic_the_dead',
    onSpellLand: 'has the fear of life put',
    castTime: 2,
    duration: 0.9,
    icon: 'lich'
  },
  call_of_bones: {
    name: 'Call of Bones',
    id: 'call_of_bones',
    onSpellLand: 'You feel the skin peel from your bones.',
    castTime: 0,
    // 11:12 base + 18sec/level above 34
    duration: parseInt((11.2 + (characterLevel > 34 ? (characterLevel - 34) * .3 : 0)).toFixed()),
    icon: 'lich'
  },
  vampiric_curse: {
    name: 'Vampiric Curse',
    id: 'vampiric_curse',
    onSpellLand: 'pales.',
    castTime: 0,
    duration: 0.9,
    icon: 'lich'
  },
  chilling_embrace: {
    name: 'Chilling Embrace',
    id: 'chilling_embrace',
    onSpellLand: 'wracked by chilling poison.',
    duration: 1.6,
    icon: 'poison'
  },
  dooming_darkness: {
    name: 'Dooming Darkness',
    id: 'dooming_darkness',
    onSpellLand: 'is engulfed in darkness.',
    duration: 1.6,
    icon: 'lich'
  },
  engulfing_darkness: {
    name: 'Engulfing Darkness',
    id: 'engulfing_darkness',
    onSpellLand: 'is engulfed in darkness.',
    duration: 1.1,
    icon: 'lich'
  },
  scourge: {
    name: 'Scourge',
    id: 'scourge',
    onSpellLand: 'sweats and shivers, looking feverish.',
    duration: 2.1,
    icon: 'skull_disease'
  },
  venomOfTheSnake: {
    name: 'Venom of the Snake',
    id: 'venom_of_the_snake',
    onSpellLand: 'has been poisoned.',
    duration: 1.2,
    icon: 'poison'
  },
  greater_shielding: {
    name: 'Greater shielding',
    id: 'greater_shielding',
    onSpellLand: 'You feel armored.',
    duration: 54,
    icon: 'shield'
  },
  steelskin: {
    name: 'Steelskin',
    id: 'steelskin',
    onSpellLand: 'Your skin becomes like steel',
    onWearOff: 'Your skin returns to normal',
    duration: 72,
    icon: 'shield'
  },
  invoke_fear: {
    name: 'Invoke Fear',
    id: 'invoke_fear',
    onSpellLand: 'looks very afraid.',
    duration: 0.7,
    icon: 'lich'
  }
  
}