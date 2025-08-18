import gameState from "./GameState.js";

class Spell {
  constructor () {
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
    ];
  }

  isSpellCast(line) {
    // this.debugLog('Checking Spell Cast:', line);
    const currentSpellId = this.currentSpell?.toLowerCase().replace(/ /g, '_');

    const isSpellCast = this.spellCastSignatures.some(signature => line?.includes(signature))
    || line?.includes(this.spellSignatures[currentSpellId]);

    return isSpellCast
  }

  isNewCast(line) {
    return line?.includes('You begin casting');
  }

  isInterrupted(line) {
    return line?.includes('Your spell is interrupted');
  }

  isFizzle(line) {
    return line?.includes('Your spell fizzles!');
  }

  handleSpellCast(line) {
    if (this.isNewCast(line)) {
      const spellName = line.split('You begin casting ')[1].split('.').shift();
      gameState.currentSpell = spellName;
      // this.debugLog('Current Spell:', gameState.currentSpell);
      return
    }

    if (this.isInterrupted(line)) {
      // this.debugLog('Spell Interrupted:', gameState.currentSpell);
      gameState.currentSpell = 'INTERRUPTED!';
      setTimeout(() => gameState.currentSpell = null, 2000);
      return
    }

    if (this.isFizzle(line)) {
      // this.debugLog('Spell Fizzled:', gameState.currentSpell);
      gameState.currentSpell = 'FIZZLE!';
      setTimeout(() => gameState.currentSpell = null, 2000);
      return
    }

    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_');
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.debugLog('UNKNOWN SPELL:', gameState.currentSpell);
    if (spellId && line?.includes(spellSignature)) {
      // this.debugLog('Spell Complete: ', gameState.currentSpell);
      gameState.currentSpell = null;
      return
    }
  }

}

export default new Spell();