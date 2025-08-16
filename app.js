const { dir } = require('console');
const fs = require('fs');

const filePath = '/mnt/c/Everquest/Logs/eqlog_Jakxitz_P1999Green.txt';

const enableLogging = false;

let eqLog;
let readIteration = 0;
let previousLineCount = 0;
let currentLineCount = 0;
const printFullLog = false;
const compassEnabled = true; 
const locationEnabled = true;
const currentZoneEnabled = true;
setInterval(() => {
  debugLog('New reading cycle: ', readIteration);
  readIteration += 1;
  if (readIteration === 1 && !printFullLog) return;
  
  fs.readFile(filePath, 'utf8', (err, data) => {

      if (err) {
          console.error('Error reading the file:', err);
          return;
      }
      eqLog = data.split('\n');

      if (currentZoneEnabled) getCurrentZone(eqLog);

      currentLineCount = eqLog.length - 1;
      debugLog(`Current line count: ${currentLineCount}, Previous line count: ${previousLineCount}`);

      eqLog = eqLog.slice(previousLineCount, currentLineCount);

      previousLineCount = currentLineCount;


      // Anything below this point is only read after first read
      
      eqLog.forEach(line => {
        if (compassEnabled) getCompassDirection(line)
        if (locationEnabled) getLocationData(line);
      });
    });
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