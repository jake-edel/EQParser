import type { Coordinates } from "../types/types";

class GameState {
  currentLocation: Coordinates | null = null
  compassDirection: string | null = null
  currentZone: string | null = null
  currentSpell: string | null = null
  currentPet: string | null = null
  petStatus: string | null = null

  log() {
    console.clear();
    const dashBoardString = `
      Location: ${this.currentLocation || ''}
      Compass Direction: ${this.compassDirection || ''}
      Zone: ${this.currentZone || ''}
      Spell: ${this.currentSpell || ''}
      Pet Name: ${this.currentPet || ''}
      Pet Status: ${this.petStatus || ''}
    `;
    console.log(dashBoardString);
  }
}

export default new GameState()