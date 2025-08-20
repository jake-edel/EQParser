import LogWatcher from './src/LogWatcher.js';
import Parser from './src/Parser.js';

const dashboardMode = process.argv[2] === 'dashboard';

const parser = new Parser({ dashboardMode });
const logWatcher = new LogWatcher(parser);

await logWatcher.startWatchingLog();

parser.beginParsing();