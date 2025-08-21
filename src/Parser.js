import gameState from './GameState.js';
import parseRegistry from './utils/parseRegistry.js';


class Parser {
  constructor({
    dashboardMode = false,
  } = {}
) {
    this.dashboardMode = dashboardMode; // Display a dashboard in the console
  }

  readLine(line) {
    if (!line) return;

    for (const { test, handle } of parseRegistry) {
      if (test(line)) {
        handle(line);
        return;
      }
    }
  }
  
  beginParsing() {
    if (this.dashboardMode) setInterval(() => gameState.log(), 1000);
  }
}

export default new Parser();