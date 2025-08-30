import server from "./Server.ts";
import Debugger from "./Debugger.ts";
import type { Coordinates } from "../types/types";

class GameState {
  location: Coordinates = { x: 0, y: 0, z: 0 }
  compassDirection = ''
  zone = ''
  currentSpell = ''
  petName = ''
  petStatus = ''
  camping = ''
  debug = new Debugger(this.constructor.name)

  // constructor() {
  //   setInterval(() => {
  //     console.clear()
  //     this.log()
  //   }, 500)
  // }


  set(property: string, value: string | object) {
    this.debug.log('Setting game state:', property, value)
    if (!this[property]) throw new Error('Invalid key passed: ' + property)
    this[property] = value
    server.send(value, property)
  }

  log() {
    const { x, y, z } = this.location
    const location = `X:${x} Y: ${y} Z:${z} `
    const state = `
      Location: ${location}
      Compass direction: ${this.compassDirection}
      Zone: ${this.zone}
      Spell: ${this.currentSpell}
      Pet name: ${this.petName}
      Camping: ${this.camping}
    `
    console.log(state)
  }
}

export default new GameState()