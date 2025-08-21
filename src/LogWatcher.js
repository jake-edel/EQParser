import fs from 'fs'
import Debugger from './Debugger.js';

class LogWatcher {
  constructor(parser) {
    this.filePath = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt';
    this.file = null
    this.lastReadPosition = 0;
    this.leftover = '';
    this.parser = parser;
    this.debounceTimer = null
    this.debug = new Debugger(this.constructor.name);

    // this.debug.enable()
  }

  async getFileSize() {
    try {
      return (await fs.promises.stat(this.filePath)).size;
    } catch (error) {
      this.debug.log('Error getting log size:', error);
    }
  }

  async openFile() {
    try {
      this.file = await fs.promises.open(this.filePath, 'r');
    } catch (error) {
      this.debug.log('Error opening file:', error);
    }
  }

  async readFile(readLength) {
    try {
      this.debug.log('Getting ready to read', readLength, 'new bytes');
      const { buffer, bytesRead } = await this.file.read(Buffer.alloc(readLength), 0, readLength, this.lastReadPosition)
      if (bytesRead <= 0) this.debug.log('No data read from file. How did you manage to fuck that up')
      this.lastReadPosition += bytesRead;

      return buffer
    } catch (error) {
      this.debug.log('Error reading file:', error);
    }
  }

  bytesToKB(bytes) {
    return bytes / 1024;
  }
  bytesToMB(bytes) {
    return bytes / (1024 * 1024);
  }
  bytesToGB(bytes) {
    return bytes / (1024 * 1024 * 1024);
  }
  getByteSize(bytes) {
    if (bytes > 1024 * 1024 * 1024)  return this.bytesToGB(bytes).toFixed(2) + ' GB';
    if (bytes > 1024 * 1024) return this.bytesToMB(bytes).toFixed(2) + ' MB';
    if (bytes > 1024) return this.bytesToKB(bytes).toFixed(2) + ' KB';
    return bytes + ' Bytes';
  }

  async startWatchingLog() {
    // Before we begin our watch, get our initial file size
    // which will tell us where to being watching,
    // and how much to read when we detect a new write
    this.lastReadPosition = await this.getFileSize();
    this.debug.log('Log size:', this.getByteSize(this.lastReadPosition), '\n');

    // Watch for change events emitted from the log file
    fs.watch(this.filePath, eventType => {
      if (eventType === 'change') {
        this.debug.log('Change event detected');
        
        // We'll start watching 50ms after detecting our file change
        // If multiple writes happen within that period, we only
        // want to trigger a single read.
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.onFileChangeEvent(eventType), 50);
      }
    });
  }

  async onFileChangeEvent() {
    await this.openFile();

    const buffer = await this.handleFileRead();
    const lines = this.formatBuffer(buffer);
    lines.forEach(line => this.parser.readLine(line.trim()));

    await this.file.close();
  }

  async handleFileRead() {
    // Compare the size of the file to its last known size,
    // to determine how much needs to be read
    let currentFileSize = await this.getFileSize();
    let readLength = currentFileSize - this.lastReadPosition;
    if (readLength <= 0) return Buffer.alloc(0)

    let buffers = [];

    const buffer = await this.readFile(readLength);
    buffers.push(buffer);

    // Double check the size of the file
    // If it has changed, we will enter a loop where we continually check the file size
    // and read the new data until we no longer detect a difference in file size
    // from before the read vs after
    let newFileSize = await this.getFileSize();
    while (newFileSize > currentFileSize) {
      this.debug.log('File size changed during read');
      readLength = newFileSize - this.lastReadPosition;
      if (readLength <= 0) break

      let buffer = await this.readFile(readLength);
      buffers.push(buffer);

      currentFileSize = newFileSize;
      newFileSize = await this.getFileSize();
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
