import parseRegistry from '../utils/parseRegistry.js';
import server from './Server.js';
import stripTimestamp from '../utils/stripTimestamp.js';

class Parser {
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