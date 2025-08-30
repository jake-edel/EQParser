import Debugger from "../Debugger.ts";
import gameState from "../GameState.ts";

class Camping {
  debug = new Debugger(this.constructor.name).enable();
  campingPattern: RegExp = /^it will take (?:you )?about (\d+) (?:more )?seconds to prepare your camp\.$/i;;

  handleMakeCamp(line: string): void {

    if (this.isAbandonCamp(line)) {
      gameState.set('camping', 'abandon')
      return;
    }

    if (this.isCampingMessage(line)) {
      const match = this.campingPattern.exec(line);
      if (!match) return;

      const secondsToCamp = match[1];
      gameState.set('camping', secondsToCamp)
    }
  }

  isAbandonCamp(line: string): boolean {
    return line.includes('You abandon your preparations to camp.');
  }

  isPreparingToCamp(line: string): boolean {
    return this.campingPattern.test(line);
  }

  isCampingMessage(line: string): boolean {
    return this.isPreparingToCamp(line) || this.isAbandonCamp(line);
  }
}

export default new Camping();
