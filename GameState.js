class GameState {
  constructor() {
    this.currentLocation = null;
    this.compassDirection = null;
    this.currentZone = null;
    this.currentSpell = null;
    this.currentPet = null;
  }

  log() {
    console.clear();
    const dashBoardString = `
      Location: ${this.currentLocation || ''}
      Compass Direction: ${this.compassDirection || ''}
      Zone: ${this.currentZone || ''}
      Spell: ${this.currentSpell || ''}
      Pet Name: ${this.currentPet || ''}
    `;
    console.log(dashBoardString);
  }
}

export default new GameState()