import gameState from './GameState.js';
import location from './Location.js';
import spell from './Spell.js';
import pet from './Pet.js';

class Parser {
  constructor({
    readRawInput = false,
    dashboardMode = false
  } = {}
) {
    this.readRawInput = readRawInput; // Read each line as it comes straight from the log
    this.dashboardMode = dashboardMode; // Display a dashboard in the console
    this.debugMode = false; 
  }
  debugLog() {
    if (this.debugMode) console.log(...arguments);
  }

  readLine(line) {
    if (!line) return;
    
    if (this.readRawInput) console.log(line);

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
    if (this.readRawInput) return
    if (this.dashboardMode) setInterval(() => gameState.log(), 1000);
  }
}

export default Parser;