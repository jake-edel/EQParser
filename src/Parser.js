import parseRegistry from './utils/parseRegistry.js';
import Debugger from './Debugger.js';
import server from './Server.js';


class Parser {
  constructor() {
    this.debug = new Debugger();
    this.debug.enable()
  }

  readLine(line) {
    if (!line) return;
    server.send(this.stripTimestamp(line), 'log');

    for (const { condition, handler } of parseRegistry) {
      if (condition(line)) {
        handler(line);
        return;
      }
    }
  }

  stripTimestamp(line) {
    return line.replace(/^\[[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\]\s*/, '').trim();
  }
}

export default new Parser();