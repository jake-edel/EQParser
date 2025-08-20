import fs from 'fs'
import Debugger from './Debugger.js';

class LogWatcher {
  constructor(parser) {
    this.filePath = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt';
    this.file = null
    this.readBuffer = null;
    this.lastReadPosition = 0;
    this.leftover = '';
    this.parser = parser;
    this.debug = new Debugger(this.constructor.name).enable();
    this.debounceTimer = null
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
      const { bytesRead } = await this.file.read(this.readBuffer, 0, readLength, this.lastReadPosition)
      // if (bytesRead <= 0) throw new Error('No data read from file. How did you manage to fuck that up')
      
      return bytesRead
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
    if (bytes < 1024) {
      return bytes + ' Bytes';
    } else if (bytes < 1024 * 1024) {
      return this.bytesToKB(bytes).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return this.bytesToMB(bytes).toFixed(2) + ' MB';
    } else {
      return this.bytesToGB(bytes).toFixed(2) + ' GB';
    }
  }

  async startWatchingLog() {
    this.lastReadPosition = await this.getFileSize();
    this.debug.log('Log size:', this.getByteSize(this.lastReadPosition), '\n');


    fs.watch(this.filePath, eventType => {
      if (eventType === 'change') {
        this.debug.log('Change event detected');

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.onFileChangeEvent(eventType), 50);
      }
    });
  }

  async onFileChangeEvent(eventType) {
    if (eventType !== 'change')
      throw new Error('Unexpected file event type: ' + eventType);

    await this.handleFileRead();

    const data = this.readBuffer.toString('utf8');
    const lines = this.handleLineSplit(data);
    lines.forEach(line => this.parser.readLine(line.trim()));

    await this.file.close();
  }

  async handleFileRead() {
    await this.openFile();
    
    const currentFileSize = await this.getFileSize();
    const readLength = currentFileSize - this.lastReadPosition;
    if (readLength <= 0) return
    this.readBuffer = Buffer.alloc(readLength);
    const bytesRead = await this.readFile(readLength);
    this.lastReadPosition += bytesRead
    const newFileSize = await this.getFileSize();
    if (newFileSize > currentFileSize) {
      this.debug.log('File size changed during read, re-reading');
      this.handleFileRead()
    }
  }
  handleLineSplit(data) {
    data += this.leftover; // Append any leftover data from the previous chunk
    data = data.replace(/\r/g, ''); // Remove carriage returns

    let lines = data.split('\n');
    // Last array item will either be the incomplete line or empty
    // We'll use that to check for incomplete lines on the next iteration
    this.leftover = lines.pop();
    this.debug.log('New log lines:', lines, '\n');

    return lines;
  }
}

export default LogWatcher;
