import Debugger from "./Debugger.ts";
import server from "./Server.ts";
import gameState from "./GameState.ts";
import stripTimestamp from "../utils/stripTimestamp.ts";

class Camping {
  debug = new Debugger(this.constructor.name).enable();
  campingPattern: RegExp = /^it will take (?:you )?about (\d+) (?:more )?seconds to prepare your camp\.$/i;;

  handleMakeCamp(line: string): void {
    line = stripTimestamp(line);

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
    return this.campingPattern.test(stripTimestamp(line));
  }

  isCampingMessage(line: string): boolean {
    line = stripTimestamp(line);
    return this.isPreparingToCamp(line) || this.isAbandonCamp(line);
  }
}

export default new Camping();
