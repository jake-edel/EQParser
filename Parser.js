import gameState from './GameState.js';
import location from './Location.js';

class Parser {
  constructor({
    readRawInput = false,
    dashboardMode = false
  } = {}
) {
    this.readRawInput = readRawInput; // Read each line as it comes straight from the log
    this.dashboardMode = dashboardMode; // Display a dashboard in the console
    this.debugMode = false;
    this.spellSignatures = {
      deadeye: 'Your vision shifts.',
      shadow_sight: 'The shadows fade.',
      gather_shadows: 'You gather shadows about you.'
    }
    this.spellCastSignatures = [
      'You begin casting',
      'Your spell is interrupted',
      'Your spell fizzles!',
      this.spellSignatures[this.currentSpellId]
    ],
    this.petSignatures = [
      'At your service master.',
      'Sorry, Master..calming down.',
      'Following you, Master.'
    ]
  }
  debugLog() {
    if (this.debugMode) console.log(...arguments);
  }

  readLine(line) {
    if (!line) return;
    if (this.readRawInput && !this.debugMode) {
      console.log(line);
    } else {
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

        case this.isSpellCast(line):
          this.handleSpellCast(line);
          break;

        case this.isPetData(line):
          this.getPetData(line);
          break;

        default:
          return
      }
    }
  }

  isSpellCast(line) {
    this.debugLog('Checking Spell Cast:', line);
    const currentSpellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');

    const isSpellCast = this.spellCastSignatures.some(signature => line?.includes(signature))
    || line?.includes(this.spellSignatures[currentSpellId]);

    return isSpellCast
  }

  isPetData(line) {
    this.debugLog('Checking Pet Data:', line);
    return this.petSignatures.some(signature => line.includes(signature));
  }

  getPetData(line) {
    const [ , , , , , petName] = line.split(' ');
    gameState.currentPet = petName;
    this.debugLog('Current Pet:', gameState.currentPet);
  }

//   function getCurrentZone(log) {
//   const zoneData = log.filter(line => line.includes('You have entered'));
//   if (zoneData) {
//     const zoneName = zoneData[zoneData.length - 1].split('You have entered ')[1].split('.').shift();
//     console.log(zoneName);
//     return zoneName;
//   }
// }

  handleSpellCast(line) {
    if (line?.includes('You begin casting')) {
      const spellName = line.split('You begin casting ')[1].split('.').shift();
      gameState.currentSpell = spellName;
      this.debugLog('Current Spell:', gameState.currentSpell);
      return
    }
    if (line?.includes('Your spell is interrupted')) {
      this.debugLog('Spell Interrupted:', gameState.currentSpell);
      gameState.currentSpell = 'INTERRUPTED!';
      setTimeout(() => gameState.currentSpell = null, 2000);
      return
    }

    if (line?.includes('Your spell fizzles!')) {
      this.debugLog('Spell Fizzled:', gameState.currentSpell);
      gameState.currentSpell = 'FIZZLE!';
      setTimeout(() => gameState.currentSpell = null, 2000);
      return
    }

    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.debugLog('UNKNOWN SPELL:', gameState.currentSpell);
    if (spellId && line?.includes(spellSignature)) {
      this.debugLog('Spell Complete: ', gameState.currentSpell);
      gameState.currentSpell = null;
      return
    }
  }
  
  beginParsing() {
    if (this.readRawInput) return
    if (this.dashboardMode) setInterval(() => gameState.log(), 1000);
  }
}

export default Parser;