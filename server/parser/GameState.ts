import server from "./Server.ts";
import playerCharacter from './PlayerCharacter.ts'
import Debugger from "./Debugger.ts";
import type { Coordinates, CoinQuantity } from "../types/types";

class GameState {
  location: Coordinates = { x: 0, y: 0, z: 0 }
  coinLoot: CoinQuantity = { platinum: 0, gold: 0, silver: 0, copper: 0 }
  compassDirection = ''
  zone = ''
  currentSpell = ''
  petName = ''
  petStatus = ''
  camping = ''
  playerCharacter = playerCharacter
  debug = new Debugger(this.constructor.name).enable()

  constructor() {
    server.connectionHandlers.push(this.onClientConnect)
  }

  set(property: string, value: string | object) {
    if (typeof this[property] === 'undefined') throw new Error('Invalid key passed: ' + property)
    this[property] = value
    server.send(value, property)
  }

  async onClientConnect(socket: WebSocket) {
    const payload = { playerCharacter: playerCharacter.data() };
    const data = Buffer.from(JSON.stringify(payload));
    socket.send(data)
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