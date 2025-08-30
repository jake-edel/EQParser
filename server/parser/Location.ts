import gameState from "./GameState.ts";
import Debugger from "./Debugger.ts";
import server from "./Server.ts";
import stripTimestamp from "../utils/stripTimestamp.ts";
import logFile from '../parser/LogFile.ts'
import type { Coordinates } from '../types/types.d.ts'

class Location {
  senseHeadingPattern = /^you think you are heading (\w+)\.$/i;
  zonePattern = /you have entered (\D+)\./i
  debug = new Debugger(this.constructor.name)

  isDirection(line: string): boolean {
    return this.senseHeadingPattern.test(stripTimestamp(line));
  }

  getCompassDirection(line: string): void {
    line = stripTimestamp(line);
    const match = this.senseHeadingPattern.exec(line)
    if (!match) return;

    const direction = match[1];
    this.debug.log('Compass Direction:', direction);
    gameState.set('compassDirection', direction)
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
    this.debug.log('Current Location:', location);
    gameState.set('location', location)
  }

  isZone(line: string): boolean {
    return this.zonePattern.test(line)
  }

  getCurrentZone(line: string): void {
    const match = this.zonePattern.exec(line)
    if (!match) throw new Error()
    const zoneName = match[1];
    gameState.set('zone', zoneName)
    this.debug.log(' Current Zone:', gameState.zone);
  }

  // Looks backwards through the log for a pattern matching a zone message
  // The first instance of this will be the current zone of the character
  async searchForCurrentZone() {
    await logFile.open()

    let data;
    let currentPosition;
    const readLength = 1024
    const fileSize = await logFile.size()
    currentPosition = fileSize - readLength
    
    while (!this.zonePattern.test(data)) {
      const { buffer, bytesRead } = await logFile.read(currentPosition, readLength)
      data = buffer.toString()
      const newlineLocation = data.indexOf('\n')
      currentPosition -= (bytesRead + newlineLocation)
      if (currentPosition <= 0) break
    }
    const match = this.zonePattern.exec(data)
    if (match) {
      const zoneName = match[1]
      this.debug.log('Current zone: ', zoneName)
      gameState.set('zone', zoneName)
    }

    await logFile.close()
  }
}

export default new Location();