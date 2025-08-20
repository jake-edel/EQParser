import gameState from './GameState.js';
import location from './Location.js';
import spell from './Spell.js';
import pet from './Pet.js';

class Parser {
  constructor({
    dashboardMode = false,
  } = {}
) {
    this.dashboardMode = dashboardMode; // Display a dashboard in the console
  }

  readLine(line) {
    if (!line) return;

    switch (true) {
      case location.isDirection(line):
        location.getCompassDirection(line);
        break;

      case location.isLocation(line):
        location.getLocationData(line);
        break;

      case location.isZone(line):
        location.getCurrentZone(line);
        break;

      case spell.isSpellCast(line):
        spell.handleSpellCast(line);
        break;

      case pet.isPetData(line):
        pet.handlePetData(line);
        break;

      default:
        return
    }
  }
  
  beginParsing() {
    if (this.dashboardMode) setInterval(() => gameState.log(), 1000);
  }
}

export default Parser;