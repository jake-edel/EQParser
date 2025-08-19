import LogWatcher from './LogWatcher.js';
import Parser from './Parser.js';

const readRawInput = process.argv[2] === 'raw';
const dashboardMode = process.argv[2] === 'dashboard';


const parser = new Parser({ readRawInput, dashboardMode });
const logWatcher = new LogWatcher(parser);
await logWatcher.startWatchingLog();

parser.beginParsing();