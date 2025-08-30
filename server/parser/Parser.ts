import parseRegistry from '../utils/parseRegistry.ts';
import LogLine from './LogLine.ts';

class Parser {
  readLine(line) {
    const { text } = new LogLine(line)

    for (const { condition, handler } of parseRegistry) {
      if (condition(text)) {
        handler(text);
        return;
      }
    }
  }
}

export default new Parser();