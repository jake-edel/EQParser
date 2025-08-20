import gameState from "./GameState.js";

class Location {

  isDirection(line) {
    return line.includes('You think you are heading');
  }

  getCompassDirection(line) {
    const direction = line.split(' ').pop().slice(0, -2);
    gameState.compassDirection = direction;
    // this.debugLog('Compass Direction:', direction);
  }

  isLocation(line) {
    return line.includes('Your Location is');
  }

  getLocationData(line) {
    // Example line: [Sat Aug 16 08:54:54 2025] Your Location is -1218.92, 827.11, 3.04
    const [, , , , , , , , y, x, z] = line.replace(',', '').split(' ');
    gameState.currentLocation = `X: ${x} Y: ${y} Z: ${z}`;
    // this.debugLog('Current Location:', gameState.currentLocation);
  }

  isZone(line) {
    return line.includes('You have entered');
  }

  getCurrentZone(line) {
    const zoneName = line.split('You have entered ')[1].split('.').shift();
    gameState.currentZone = zoneName;
    // this.debugLog(' Current Zone:', gameState.currentZone);
  }
}

export default new Location();