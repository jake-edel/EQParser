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
    type: 'pet'
  },
  spirit_of_wolf: {
    name: 'Spirit of Wolf',
    id: 'spirit_of_wolf',
    castTime: 0,
    onSpellLand: 'You feel the spirit of wolf enter you.',
    type: 'buff',
    duration: 40
  },
  deadeye: {
    name: 'Deadeye',
    id: 'deadeye',
    onSpellLand: 'Your vision shifts.',
    type: 'buff',
    duration: 24
  },
  shadow_sight: {
    name: 'Shadow Sight',
    id: 'shadow_sight',
    onSpellLand: 'The shadows fade.',
    onWearOff: 'Your shadow sight fades.',
    type: 'buff',
    duration: 27
  },
  gather_shadows: {
    name: 'Gather Shadows',
    id: 'gather_shadows',
    onSpellLand: 'You gather shadows about you.',
    castTime: 5,
    wearOff: 'Your shadows fade',
    type: 'buff',
    duration: 20
    
  },
  augment_death: {
    name: 'Augment Death',
    id: 'augment_death',
    onSpellLand: 'gleam with madness',
    // duration: [
    //   {
    //     level: 39,
    //     duration: 12.7
    //   },
    //   {
    //     level: 47,
    //     duration: 15
    //   }
    // ]
    duration: 12.7
  },
  panic_the_dead: {
    name: 'Panic the dead',
    id: 'panic_the_dead',
    onSpellLand: 'has the fear of life put',
    castTime: 2,
    duration: 0.9
  },
  call_of_bones: {
    name: 'Call of Bones',
    id: 'call_of_bones',
    onSpellLand: 'You feel the skin peel from your bones.',
    castTime: 0,
    duration: 11 // 11:12 base + 18sec/level above 34
  },
  vampiric_curse: {
    name: 'Vampiric Curse',
    id: 'vampiric_curse',
    onSpellLand: 'pales.',
    castTime: 0,
    duration: 0.9
  },
  
}