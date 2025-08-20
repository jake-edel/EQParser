import gameState from "./GameState.js";

class Spell {
  constructor () {
    this.spellSignatures = {
      deadeye: 'Your vision shifts.',
      shadow_sight: 'The shadows fade.',
      gather_shadows: 'You gather shadows about you.',
      malignant_dead: 'At your service master',
      augment_death: 'gleam with madness',
      panic_the_dead: 'has the fear of life put'
    }
    this.spellCastSignatures = [
      'You begin casting',
      'Your spell is interrupted',
      'Your spell fizzles!',
      this.spellSignatures[this.currentSpellId]
    ];
  }

  isSpellCast(line) {
    const currentSpellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');

    const isSpellCast = this.spellCastSignatures.some(signature => line?.includes(signature))
    || line?.includes(this.spellSignatures[currentSpellId]);

    return isSpellCast
  }

  isNewCast(line) {
    return line?.includes('You begin casting');
  }

  setCurrentSpell(line) {
    if (this.isNewCast(line)) {
      const spellName = line.split('You begin casting ')[1].split('.').shift();
      gameState.currentSpell = spellName;
    }
  }

  isInterrupted(line) {
    return line?.includes('Your spell is interrupted');
  }

  setSpellInterrupted() {
    gameState.currentSpell = 'INTERRUPTED!';
    setTimeout(() => gameState.currentSpell = null, 2000);
  }

  isFizzle(line) {
    return line?.includes('Your spell fizzles!');
  }
  setSpellFizzle() {
    gameState.currentSpell = 'FIZZLE!';
    setTimeout(() => gameState.currentSpell = null, 2000);
  }

  isSpellComplete(line) {
    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    return spellId && line?.includes(spellSignature);
  }

  handleSpellCast(line) {
    if (this.isNewCast(line)) return this.setCurrentSpell(line)

    if (this.isInterrupted(line)) return this.setSpellInterrupted(line)

    if (this.isFizzle(line)) return this.setSpellFizzle()

    if(this.isSpellComplete()) return this.setSpellComplete() 

    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.debugLog('UNKNOWN SPELL:', gameState.currentSpell);
    if (spellId && line?.includes(spellSignature)) gameState.currentSpell = null;
  }

}

export default new Spell();