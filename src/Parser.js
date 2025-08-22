import gameState from './GameState.js';
import parseRegistry from './utils/parseRegistry.js';
import Debugger from './Debugger.js';


class Parser {
  constructor() {
    this.debug = new Debugger(this.constructor.name);

    // this.debug.enable()
  }

  readLine(line) {
    if (!line) return;
    this.debug.log(line);

    for (const { condition, handler } of parseRegistry) {
      if (condition(line)) {
        handler(line);
        return;
      }
    }
  }
  
  beginParsing() {
    if (this.dashboardMode) setInterval(() => gameState.log(), 1000);
  }
}

export default new Parser();