import server from "./Server.ts";
import playerCharacter from './PlayerCharacter.ts'
import Debugger from "./Debugger.ts";
import type { Coordinates, CoinQuantity, Spell } from "../types/types";

class GameState {
  location: Coordinates = { x: 0, y: 0, z: 0 }
  coinLoot: CoinQuantity = { 
   total: {platinum: 0, gold: 0, silver: 0, copper: 0},
   received: {platinum: 0, gold: 0, silver: 0, copper: 0}
  }
  compassDirection = ''
  zone = ''
  currentSpells: Spell[] = []
  petName = ''
  petStatus = ''
  camping = ''
  playerCharacter = playerCharacter.info()
  debug = new Debugger(this.constructor.name).enable()

  constructor() {
    server.connectionHandlers.push(
      () => server.send(this.playerCharacter, 'playerCharacter'),
      () => server.send(this.coinLoot, 'coinLoot'),
      () => server.send(this.location, 'location')
    )
  }

  set(event: string, value: string | object | Spell) {
    // if (typeof this[event] === 'undefined') throw new Error('Invalid key passed: ' + event)
    if (this.isSpell(value)) {
      this.currentSpells.push(value)
    } else {
      this[event] = value
    }
    server.send(value, event)
  }

  isSpell(value: string | object | Spell): value is Spell {
    return (value as Spell).name !== undefined
  }

  clearSpell(id: string) {
    this.currentSpells = this.currentSpells.filter(currentSpell => currentSpell.id !== id)
  }

  // TODO: refine spell state  tracking
  // handleSpell(event: string, spell: Spell) {
  //   if (event === 'spellCast') this.currentSpells.push(spell)
  //   if (event === 'spellInterrupt' || event === 'spellFizzle') this.clearSpell(spell.id)
  //   if (event === 'spellLanded') {
  //     spell.duration ? console.log('setSpellTimeout') : this.clearSpell(spell.id)
  //   }
  // }

  log() {
    const { x, y, z } = this.location
    const location = `X:${x} Y: ${y} Z:${z} `
    const state = `
      Location: ${location}
      Compass direction: ${this.compassDirection}
      Zone: ${this.zone}
      Spells: ${this.currentSpells.map(spell => spell.name)}
      Pet name: ${this.petName}
      Camping: ${this.camping}
    `
    console.log(state)
  }
}

export default new GameState()