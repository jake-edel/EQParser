class Parser {
  constructor({
    readRawInput = false,
    dashboardMode = false
  } = {}
) {
    this.currentLocation = null;
    this.compassDirection = null;
    this.currentZone = null;
    this.currentSpell = null;
    this.currentPet = null;
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
      'Sorry, Master..calming down.'
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
        case line.includes('You think you are heading'):
          this.getCompassDirection(line);
          break;

        case line.includes('Your Location is'):
          this.getLocationData(line);
          break;

        case line.includes('You have entered'):
          this.getCurrentZone(line);
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

  getCompassDirection(line) {
    const direction = line.split(' ').pop().slice(0, -2);
    this.compassDirection = direction;
    this.debugLog('Compass Direction:', direction);
  }

  getLocationData(line) {
    // Example line: [Sat Aug 16 08:54:54 2025] Your Location is -1218.92, 827.11, 3.04
    const [, , , , , , , , y, x, z] = line.replace(',', '').split(' ');
    this.currentLocation = `X: ${x} Y: ${y} Z: ${z}`;
    this.debugLog('Current Location:', this.currentLocation);
    if (line?.includes('Your Location is')) {
    }
  }

  getCurrentZone(line) {
    const zoneName = line.split('You have entered ')[1].split('.').shift();
    this.currentZone = zoneName;
    this.debugLog('Current Zone:', this.currentZone);
  }

  getPetData(line) {
    const lineParts = line.split(' ');
    console.log(lineParts); 
    this.currentPet = lineParts[5];
    this.debugLog('Current Pet:', this.currentPet);
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
      this.currentSpell = spellName;
      this.debugLog('Current Spell:', this.currentSpell);
      return
    }
    if (line?.includes('Your spell is interrupted')) {
      this.debugLog('Spell Interrupted:', this.currentSpell);
      this.currentSpell = 'INTERRUPTED!';
      setTimeout(() => this.currentSpell = null, 2000);
      return
    }

    if (line?.includes('Your spell fizzles!')) {
      this.debugLog('Spell Fizzled:', this.currentSpell);
      this.currentSpell = 'FIZZLE!';
      setTimeout(() => this.currentSpell = null, 2000);
      return
    }

    const spellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.debugLog('UNKNOWN SPELL:', this.currentSpell);
    if (spellId && line?.includes(spellSignature)) {
      this.debugLog('Spell Complete: ', this.currentSpell);
      this.currentSpell = null;
      return
    }
  }
  
  beginParsing() {
    if (this.readRawInput) return
    if (this.dashboardMode) setInterval(() => this.logGameState(), 1000);
  }
  
  logGameState() {
    console.clear();
    const dashBoardString = `
      Location: ${this.currentLocation}
      Compass Direction: ${this.compassDirection}
      Zone: ${this.currentZone}
      Spell: ${this.currentSpell}
      Pet Name: ${this.currentPet}
    `;
    console.log(dashBoardString);
  }
}

export default Parser;