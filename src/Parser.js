import parseRegistry from './utils/parseRegistry.js';
import Debugger from './Debugger.js';
import server from './Server.js';
import stripTimestamp from './utils/stripTimestamp.js';

class Parser {
  constructor() {
    this.debug = new Debugger();
    this.debug.enable()
  }

  readLine(line) {
    if (!line) return;
    server.send(stripTimestamp(line), 'log');

    for (const { condition, handler } of parseRegistry) {
      if (condition(line)) {
        handler(line);
        return;
      }
    }
  }
}

export default new Parser();