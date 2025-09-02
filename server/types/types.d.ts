export interface Coordinates {
  x: number,
  y: number,
  z: number
}

export interface CoinQuantity {
  platinum: number,
  gold: number,
  silver: number,
  copper: number
}

export interface PetStates {
  'following_you_master': string
  'at_your_service_master': string
  'sorry_master_calming_down': string
  'changing_position_master': string
  'guarding_with_my_life_oh_splendid_one': string
}

type DurationRange = [
  {
    level: number,
    duration: number
  }
]

export type Spell = {
  name: string
  id: string
  onSpellLand: string
  onWearOff: string | undefined
  type: string
  duration: number | DurationRange,
  instanceId: string
}