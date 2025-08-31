import gameState from "../GameState.ts";
import Debugger from "../Debugger.ts";
import logFile from '../files/LogFile.ts'
import type { Coordinates } from '../../types/types.d.ts'

class Location {
  private readonly senseHeadingPattern = /^you think you are heading (\w+)\.$/i;
  private readonly locationPattern = /^your location is (-?\d+.\d+), (-?\d+.\d+), (-?\d+.\d+)$/i
  private readonly zonePattern = /.*you have entered ([\w|\s]+).*/si
  private readonly debug = new Debugger(this.constructor.name)

  isDirection(line: string): boolean {
    return this.senseHeadingPattern.test(line);
  }

  getCompassDirection(line: string): void {
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
    const match = this.locationPattern.exec(line)
    let x, y, z
    if (match) [y, x, z] = match.slice(1, 4).map(num => parseFloat(num))

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
      const { buffer } = await logFile.read(currentPosition, readLength)
      data = buffer.toString()
      const newlineLocation = data.indexOf('\n')
      currentPosition -= (readLength + newlineLocation)
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