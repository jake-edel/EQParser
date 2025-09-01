import gameState from "../GameState.ts";
import Debugger from "../Debugger.ts";
import spells from "../../data/spells.ts";

class Spell {
  private readonly debug: Debugger = new Debugger(this.constructor.name).enable()
  private currentSpellId: string = ''
  private currentSpell: string = ''
  private readonly castingPattern = /^You begin casting (.*)\.$/i
  private readonly spellSignatures = {
    deadeye: 'Your vision shifts.',
    shadow_sight: 'The shadows fade.',
    gather_shadows: 'You gather shadows about you.',
    malignant_dead: 'At your service master',
    augment_death: 'gleam with madness',
    panic_the_dead: 'has the fear of life put'
  }
  private readonly spellCastMessages: Array<string> = [
      'You begin casting',
      'Your spell is interrupted',
      'Your spell fizzles!',
      ...(Object.keys(spells).map(spell => spells[spell].signature))
    ]
  
  toSpellId(spellName) {
    return spellName.toLowerCase().replace(/ /g, '_');
  }

  isSpellCast(line: string): boolean {
    const match = this.castingPattern.exec(line)
    let spellName;
    if (match) { spellName = match[1]}
    const spellId = spellName
    this.currentSpell = spells[spellId]

    const isSpellCast = this.spellCastMessages.some(signature => line?.includes(signature))

    return isSpellCast
  }

  isNewCast(line: string): boolean {
    return this.castingPattern.test(line)
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