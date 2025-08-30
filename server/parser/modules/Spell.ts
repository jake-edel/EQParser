import gameState from "../GameState.ts";
import Debugger from "../Debugger.ts";

class Spell {
  debug: Debugger = new Debugger(this.constructor.name).enable()
  currentSpellId: string = ''
  currentSpellName: string = ''
  spellSignatures = {
    deadeye: 'Your vision shifts.',
    shadow_sight: 'The shadows fade.',
    gather_shadows: 'You gather shadows about you.',
    malignant_dead: 'At your service master',
    augment_death: 'gleam with madness',
    panic_the_dead: 'has the fear of life put'
  }
  spellCastMessages: Array<string> = [
      'You begin casting',
      'Your spell is interrupted',
      'Your spell fizzles!',
      this.spellSignatures[this.currentSpellId]
    ]


  isSpellCast(line: string): boolean {
    const currentSpellId = this.currentSpellName?.toLowerCase().replace(/ /g, '_');

    const isSpellCast = this.spellCastMessages.some(signature => line?.includes(signature))
    || line?.includes(this.spellSignatures[currentSpellId]);

    return isSpellCast
  }

  isNewCast(line: string): boolean {
    return line?.includes('You begin casting');
  }

  setCurrentSpell(line: string): void {
    if (this.isNewCast(line)) {
      const spellName = line.split('You begin casting ')[1].split('.').shift();
      gameState.set('currentSpell', spellName || '')
    }
  }

  isInterrupted(line: string): boolean {
    return line?.includes('Your spell is interrupted');
  }

  setSpellInterrupted(): void {
    gameState.set('currentSpell', 'INTERRUPTED')
    setTimeout(() => gameState.set('currentSpell', ''), 2000);
  }

  isFizzle(line: string): boolean {
    return line?.includes('Your spell fizzles!');
  }
  setSpellFizzle(): void {
    gameState.set('currentSpell', 'FIZZLE')
    setTimeout(() => gameState.set('currentSpell', ''), 2000);
  }

  isSpellComplete(line: string): boolean {
    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_') || '';
    const spellSignature = this.spellSignatures[spellId];
    return (spellId && line?.includes(spellSignature)) || true;
  }

  handleSpellCast(line: string): void {
    if (this.isNewCast(line)) return this.setCurrentSpell(line)
    if (this.isInterrupted(line)) return this.setSpellInterrupted()
    if (this.isFizzle(line)) return this.setSpellFizzle()
    if(this.isSpellComplete(line)) gameState.set('currentSpell', 'spellComplete')

    const spellId = gameState.currentSpell?.toLowerCase().replace(/ /g, '_') || '';
    const spellSignature = this.spellSignatures[spellId];
    if (!spellSignature) this.debug.log('UNKNOWN SPELL:', gameState.currentSpell);
    if (spellId && line?.includes(spellSignature)) gameState.set('currentSpell', '');
  }
}

export default new Spell();