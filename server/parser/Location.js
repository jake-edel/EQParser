import gameState from "./GameState.js";
import Debugger from "./Debugger.js";
import server from "./Server.js";
import stripTimestamp from "../utils/stripTimestamp.js";

class Location {
  constructor() {
    this.senseHeading = /^you think you are heading (\w+)\.$/i
    this.debug = new Debugger(this.constructor.name);
    // this.debug.enable()
  }

  isDirection(line) {
    return this.senseHeading.test(stripTimestamp(line));
  }

  getCompassDirection(line) {
    line = stripTimestamp(line);
    const direction = line.match(this.senseHeading)[1];
    gameState.compassDirection = direction;
    server.send(direction, 'compassDirection');
    this.debug.log('Compass Direction:', direction);
  }

  isLocation(line) {
    return line.includes('Your Location is');
  }
  formatLocationData(line) {
    const [y, x, z] = line.replace(/\,/g, '').split(' ').slice(8);
    return { x, y, z };
  }

  getLocationData(line) {
    const location = this.formatLocationData(line);
    gameState.currentLocation = location;
    server.send(location, 'location');
    this.debug.log('Current Location:', gameState.currentLocation);
  }

  isZone(line) {
    return line.includes('You have entered');
  }

  getCurrentZone(line) {
    const zoneName = line.split('You have entered ')[1].split('.').shift();
    gameState.currentZone = zoneName;
    server.send(zoneName, 'zone');
    this.debug.log(' Current Zone:', gameState.currentZone);
  }
}

export default new Location();