export const defaultSpell = {
  name: ''
}

export const spells = {
  malignant_dead: {
    name: 'Malignant Dead',
    id: 'malignant_dead',
    signature: 'At your service master',
    castTime: 14,
    type: 'pet'
  },
  spirit_of_wolf: {
    name: 'Spirit of Wolf',
    id: 'spirit_of_wolf',
    castTime: 0,
    signature: 'You feel the spirit of wolf enter you.',
    type: 'buff',
    duration: 40
  },
  deadeye: {
    name: 'Deadeye',
    id: 'deadeye',
    signature: 'Your vision shifts.',
    type: 'buff',
    duration: 0

  },
  shadow_sight: {
    name: 'Shadow Sight',
    id: 'shadow_sight',
    signature: 'The shadows fade.',
    type: 'buff',
    duration: 0
  },
  gather_shadows: {
    name: 'Gather Shadows',
    id: 'gather_shadows',
    signature: 'You gather shadows about you.',
    castTime: 5,
    wearOff: 'Your shadows fade',
    type: 'buff',
    duration: 20
    
  },
  augment_death: {
    name: 'Augment Death',
    id: 'augment_death',
    signature: 'gleam with madness',
    duration: [
      {
        level: 39,
        duration: 12.7
      },
      {
        level: 47,
        duration: 15
      }
    ]
  },
  panic_the_dead: {
    name: 'Panic the dead',
    id: 'panic_the_dead',
    signature: 'has the fear of life put',
    castTime: 2,
    duration: 54
  }
}