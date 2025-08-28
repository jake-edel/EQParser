import gameState from "./GameState.ts";
import Debugger from "./Debugger.ts";
import server from "./Server.ts";
import stripTimestamp from "../utils/stripTimestamp.ts";
import type { Coordinates } from '../types/types.d.ts'

class Location {
  senseHeadingPattern: RegExp = /^you think you are heading (\w+)\.$/i;
  debug: Debugger = new Debugger(this.constructor.name);

  isDirection(line: string): boolean {
    return this.senseHeadingPattern.test(stripTimestamp(line));
  }

  getCompassDirection(line: string): void {
    line = stripTimestamp(line);
    const match = this.senseHeadingPattern.exec(line)
    if (!match) return;

    const direction = match[1];
    gameState.compassDirection = direction;
    server.send(direction, 'compassDirection');
    this.debug.log('Compass Direction:', direction);
  }

  isLocation(line: string): boolean {
    return line.includes('Your Location is');
  }

  formatLocationData(line: string): Coordinates {
    const [y, x, z] = line
      .replace(/,/g, '')
      .split(' ')
      .slice(8)
      .map(num => parseFloat(num));
    return { x, y, z };
  }

  getLocationData(line: string): void {
    const location = this.formatLocationData(line);
    gameState.currentLocation = location;
    server.send(location, 'location');
    this.debug.log('Current Location:', gameState.currentLocation);
  }

  isZone(line: string): boolean {
    return line.includes('You have entered');
  }

  getCurrentZone(line: string): void {
    const zoneName = line.split('You have entered ')[1].split('.').shift();
    gameState.currentZone = zoneName || '';
    server.send(zoneName, 'zone');
    this.debug.log(' Current Zone:', gameState.currentZone);
  }
}

export default new Location();