import logReader from './logReader.js';
import Parser from './parser.js';

const readRawInput = process.argv[2] === 'raw';
const dashboardMode = process.argv[2] === 'dashboard';


const parser = new Parser({ readRawInput, dashboardMode });
await logReader.startReadingLog(parser);

parser.beginParsing();