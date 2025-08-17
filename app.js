import logReader from './logReader.js';
import parser from './parser.js';

await logReader.startReadingLog();
parser.beginParsing();