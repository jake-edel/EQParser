import parser from './parser.js';

parser.startFileWatcher();

const enableLogging = false;

let readIteration = 0;
let previousLineCount = 0;
const printFullLog = true;
const compassEnabled = false; 
const locationEnabled = false;
const currentZoneEnabled = false;

// await parser.watchFile();


setInterval(async () => {
  // console.log(await watcher.next())

  // console.log(watcher)
  // for (const event of watcher) {
  //   console.log(event);
  // }

  // for await (const event of watcher) {
  //   console.log(event);
  // }
  // debugLog('New reading cycle: ', readIteration);
  // readIteration += 1;
  // if (readIteration === 1 && !printFullLog) return;

  // await parser.readFullLog();
  // const eqLog = parser.fullLog;
  // console.log(eqLog)

  // if (currentZoneEnabled) getCurrentZone(eqLog);
  // const newLines = eqLog.slice(previousLineCount, parser.logLineCount);

  // newLines.forEach(line => {
  //   if (printFullLog) console.log(line);
  //   if (compassEnabled) getCompassDirection(line)
  //   if (locationEnabled) getLocationData(line);
  // });

  // previousLineCount = parser.logLineCount;

}, 1000);

function getCompassDirection(line) {
  if (line.includes('You think you are heading')) {
    const direction = line.split(' ').pop().slice(0, -2);
    console.log(direction);
    return direction;
  }
}

function getLocationData(line) {
  if (line.includes('Your Location is')) {
    // Example line: [Sat Aug 16 08:54:54 2025] Your Location is -1218.92, 827.11, 3.04
    const [ , , , , , , , , y, x, z] = line.replace(',', '').split(' ');
    console.log(`X: ${x} Y: ${y} Z: ${z}`);
    return { x, y, z };
  }
} 

function getCurrentZone(log) {
  const zoneData = log.filter(line => line.includes('You have entered'));
  if (zoneData) {
    const zoneName = zoneData[zoneData.length - 1].split('You have entered ')[1].split('.').shift();
    console.log(zoneName);
    return zoneName;
  }
}

function debugLog() {
  if (enableLogging) console.log(...arguments);
}