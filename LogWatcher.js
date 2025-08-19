import fs from 'fs'
import Debugger from './Debugger.js';

class LogWatcher {
  constructor(parser) {
    this.filePath = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt';
    this.file = null
    this.fileSize = 0;
    this.readBuffer = Buffer.alloc(0);
    this.lastReadPosition = 0;
    this.leftover = '';
    this.parser = parser;
    this.debug = new Debugger(this.constructor.name);
    this.debug.enable();
  }

  async readFullLog() {
    try {
      const log = await fs.promises.readFile(this.testFilePath, 'utf8');
      this.fullLog = log.split('\n');
      this.fullLog.pop();
      this.logLineCount = this.fullLog.length;
    } catch (err) {
      console.error('Error reading the file:', err);
    }
  }

  async getFileSize() {
    try {
      this.fileSize = (await fs.promises.stat(this.filePath)).size;
    } catch (error) {
      this.debug.log('Error getting log size:', error);
    }

    return this.fileSize
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
      this.readBuffer = Buffer.alloc(readLength);
      const { bytesRead } = await this.file.read(this.readBuffer, 0, readLength, this.lastReadPosition)
      this.lastReadPosition += bytesRead;
      if (bytesRead <= 0) throw new Error('No data read from file. How did you manage to fuck that up')
    } catch {
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
    this.debug.log('Log size:', this.getByteSize(this.fileSize));

    fs.watch(this.filePath, this.onFileEvent.bind(this));
  }

  async onFileEvent(eventType) {
    this.debug.log('File event emitted: ', eventType);

    if (eventType !== 'change')
      throw new Error('Unexpected file event type: ' + eventType);

    const fileSize = await this.getFileSize();

    if (fileSize <= this.lastReadPosition)
      throw new Error('Log file has changed but is either truncated or modified. Consider why that may be')

    await this.openFile();
    await this.handleFileRead();
    const data = this.readBuffer.toString('utf8');
    const lines = this.handleLineSplit(data);
    lines.forEach(line => this.parser.readLine(line.trim()));

    await this.file.close();
  }
  async handleFileRead() {
    const readLength = this.fileSize - this.lastReadPosition;
    await this.readFile(readLength);
    const newFileSize = await this.getFileSize();
    if (newFileSize > this.fileSize) {
      this.debug.log('File size changed during read, re-reading');
      this.handleFileRead()
    }
  }
  handleLineSplit(data) {
    data += this.leftover; // Append any leftover data from the previous chunk
    data = data.replace(/\r/g, ''); // Remove carriage returns

    this.debug.log('Data ends with a broken line?', data.charAt(data.length - 1) !== '\n');
    let lines = data.split('\n');
    // Last array item will either be the incomplete line or empty
    // We'll use that to check for incomplete lines on the next iteration
    this.leftover = lines.pop();
    this.debug.log('New log lines:', lines);

    return lines;
  }
}

export default LogWatcher;
