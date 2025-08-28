import parseRegistry from '../utils/parseRegistry.ts';
import server from './Server.ts';
import stripTimestamp from '../utils/stripTimestamp.ts';

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