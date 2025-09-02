import gameState from "../GameState.ts";
import Debugger from "../Debugger.ts";
import { spells, defaultSpell } from "../../data/spells.ts";

class Spell {
  private readonly debug: Debugger = new Debugger(this.constructor.name).enable()
  private currentSpell = defaultSpell
  private currentSpellId = ''
  private readonly castingPattern = /^You begin casting (.*)\.$/i
  private readonly interruptPattern = /^Your spell is interrupted\.$/i
  private readonly fizzlePattern = /^Your spell fizzles!$/i
  private readonly spellSignatures: string[] = Object.keys(spells).map(spell => spells[spell].signature)
  private readonly spellCastMessages = [
      'You begin casting',
      'Your spell is interrupted',
      'Your spell fizzles!',
      ...(this.spellSignatures)
    ]
  
  toSpellId(spellName) {
    return spellName.toLowerCase().replace(/ /g, '_');
  }

  isSpellCast(line: string): boolean {
    return this.spellCastMessages.some(signature => (
      line.includes(signature)
    ))
  }

  isNewCast(line: string): boolean {
    return this.castingPattern.test(line)
  }

  isFizzle(line: string): boolean {
    return this.fizzlePattern.test(line);
  }

  isInterrupted(line: string): boolean {
    return this.interruptPattern.test(line);
  }

  isSpellLanded(line: string): boolean {
    const spellSignature = this.spellSignatures[this.currentSpellId];
    return line.includes(spellSignature);
  }

  resetSpell(): void {
    this.currentSpell = defaultSpell
    this.currentSpellId = ''
  }

  setCurrentSpell(line: string): void {
    this.currentSpell = defaultSpell
    this.currentSpellId = ''

    let spellName;
    const match = this.castingPattern.exec(line)
    if (match) { spellName = match[1]}

    this.currentSpellId = this.toSpellId(spellName)
    this.currentSpell = spells[this.currentSpellId]
    if (!this.currentSpell) return this.debug.log('Unknown spell:', spellName)
    this.currentSpell.instanceId = crypto.randomUUID()
    if (this.isNewCast(line)) gameState.set('spellCast', this.currentSpell)
  }

  setSpellInterrupted(): void {
    this.resetSpell()
    gameState.set('spellInterrupt', this.currentSpell)
  }

  setSpellFizzle(): void {
    this.resetSpell()
    gameState.set('spellFizzle', this.currentSpell)
  }

  handleSpellLanded(): void {
    this.resetSpell()
    this.debug.log('Spell landed:', this.currentSpell.name)
    gameState.set('spellLanded', this.currentSpell)
    this.currentSpell = defaultSpell
  }

  handleSpellCast(line: string): void {
    if (this.isNewCast(line)) return this.setCurrentSpell(line)
    if (this.isInterrupted(line)) return this.setSpellInterrupted()
    if (this.isFizzle(line)) return this.setSpellFizzle()
    if (this.isSpellLanded(line)) return this.handleSpellLanded()
  }
}

export default new Spell();