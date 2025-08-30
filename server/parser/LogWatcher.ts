import fs from 'fs'
import Debugger from './Debugger.ts';
import parser from './Parser.ts';
import logFile from './files/LogFile.ts';
import getByteSize from '../utils/fileSize.ts';

class LogWatcher {
  lastReadPosition = 0
  leftover = ''
  debounceTimer: NodeJS.Timeout
  debug = new Debugger(this.constructor.name)

  async startWatchingLog() {
    // Before we begin our watch, get our initial file size
    // which will tell us where to being watching,
    // and how much to read when we detect a new write
    const fileSize = await logFile.size();
    if (fileSize) { this.lastReadPosition = fileSize }
    
    this.debug.log('Log size:', getByteSize(this.lastReadPosition), '\n');

    // Watch for change events emitted from the log file
    fs.watch(logFile.path, eventType => {
      if (eventType === 'change') {
        this.debug.log('Change event detected');
        
        // We'll start watching 50ms after detecting our file change
        // If multiple writes happen within that period, we only
        // want to trigger a single read.
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.onFileChangeEvent(), 50);
      }
    });
  }

  async onFileChangeEvent() {
    await logFile.open()

    const buffer = await this.handleFileRead();
    const lines = this.formatBuffer(buffer);
    lines.forEach(line => parser.readLine(line.trim()));

    await logFile.close()
  }

  async handleFileRead() {
    // Compare the size of the file to its last known size,
    // to determine how much needs to be read
    let currentFileSize = await logFile.size()

    let readLength = currentFileSize - this.lastReadPosition;
    if (!readLength) return Buffer.alloc(0)

    let buffers: Buffer[] = [];
    const { buffer, bytesRead } = await logFile.read(this.lastReadPosition, readLength);
    this.lastReadPosition += bytesRead
    buffers.push(buffer);

    // Double check the size of the file
    // If it has changed, we will enter a loop where we continually check the file size
    // and read the new data until we no longer detect a difference in file size
    // from before the read vs after
    let newFileSize = await logFile.size();

    while (newFileSize > currentFileSize) {
      this.debug.log('File size changed during read');
      readLength = newFileSize - this.lastReadPosition;
      if (readLength <= 0) break

      let { buffer, bytesRead } = await logFile.read(this.lastReadPosition, readLength);
      this.lastReadPosition += bytesRead
      buffers.push(buffer);

      currentFileSize = newFileSize;
      newFileSize = await logFile.size() || 0;
    }
    
    // Concatenate all buffers
    return Buffer.concat(buffers);
  }

  // Convert buffer into an array of text lines,
  // cleaning up the lines along the way
  // and handling incomplete lines from the previous read
  formatBuffer(buffer) {
    let data = buffer.toString('utf8');
    data += this.leftover; // Append any leftover data from the previous chunk
    data = data.replace(/\r/g, ''); // Remove carriage returns

    let lines = data.split('\n');
    // Last array item will either be the incomplete line or empty
    // We'll use that to check for incomplete lines on the next iteration
    this.leftover = lines.pop();
    if (this.leftover.length) this.debug.log('Leftover data for next read:', this.leftover);
    this.debug.log('New log lines:', lines, '\n');

    return lines;
  }
}

export default LogWatcher;
