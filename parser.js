class Parser {
  constructor() {
    this.currentLocation = null;
    this.compassDirection = null;
    this.currentZone = null;
    this.currentSpell = null
    this.readRawInput = false;
    this.dashboardMode = true;
    this.debugMode = false
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
    ]
  }
  logLine() {
    if (this.debugMode) console.log(...arguments);
  }

  readLine(line) {
    if (this.readRawInput) {
      console.log(line);
    } else {
      switch (true) {
        case line?.includes('You think you are heading'):
          this.getCompassDirection(line);
          break;

        case line?.includes('Your Location is'):
          this.getLocationData(line);
          break;

        case line?.includes('You have entered'):
          this.getCurrentZone(line);
          break;

        case this.isSpellCast(line):
          this.handleSpellCast(line);
          break;
        default:
          return
      }
    }
  }

  isSpellCast(line) {
    const currentSpellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');

    const isSpellCast = this.spellCastSignatures.some(signature => line?.includes(signature))
    || line?.includes(this.spellSignatures[currentSpellId]);

    return isSpellCast
  }

  getCompassDirection(line) {
    if (line?.includes('You think you are heading')) {
      const direction = line.split(' ').pop().slice(0, -2);
      this.compassDirection = direction;
      this.logLine('Compass Direction:', direction);
    }
  }

  getLocationData(line) {
    if (line?.includes('Your Location is')) {
      // Example line: [Sat Aug 16 08:54:54 2025] Your Location is -1218.92, 827.11, 3.04
      const [, , , , , , , , y, x, z] = line.replace(',', '').split(' ');
      this.currentLocation = `X: ${x} Y: ${y} Z: ${z}`;
      this.logLine('Current Location:', this.currentLocation);
    }
  }

  getCurrentZone(line) {
    if (line?.includes('You have entered')) {
      const zoneName = line.split('You have entered ')[1].split('.').shift();
      this.currentZone = zoneName;
      this.logLine('Current Zone:', this.currentZone);
    }
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
      this.logLine('Current Spell:', this.currentSpell);
      return
    }
    if (line?.includes('Your spell is interrupted')) {
      this.logLine('Spell Interrupted:', this.currentSpell);
      this.currentSpell = 'INTERRUPTED!';
      setTimeout(() => this.currentSpell = null, 2000);
      return
    }

    if (line?.includes('Your spell fizzles!')) {
      this.logLine('Spell Fizzled:', this.currentSpell);
      this.currentSpell = 'FIZZLE!';
      setTimeout(() => this.currentSpell = null, 2000);
      return
    }

    const spellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.logLine('UNKNOWN SPELL:', this.currentSpell);
    if (spellId && line?.includes(spellSignature)) {
      this.logLine('Spell Complete: ', this.currentSpell);
      this.currentSpell = null;
      return
    }
  }

  logGameState() {
    console.clear();
    console.log('Current Location:', this.currentLocation);
    console.log('Compass Direction:', this.compassDirection);
    console.log('Current Zone:', this.currentZone);
    console.log('Current Spell:', this.currentSpell);
  }

  beginParsing() {
    if (this.readRawInput) return
    if (this.dashboardMode) setInterval(() => this.logGameState(), 100);
  }

}

export default new Parser();