import fs from 'fs'
import parser from './parser.js'

class LogReader {
  constructor() {
    this.filePath = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt';
    this.lastReadPosition = 0;
    this.leftover = '';
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

  async startReadingLog() {
    const fileStats = await fs.promises.stat(this.filePath);
    this.lastReadPosition = fileStats.size;
    
    fs.watch(this.filePath, eventType => {
      if (eventType === 'change') {
        fs.stat(this.filePath, (err, stats) => {
          if (err) return console.error('Error getting file stats:', err);

          if (stats.size > this.lastReadPosition) {
            const readLength = stats.size - this.lastReadPosition;

            const buffer = Buffer.alloc(readLength);
            fs.open(this.filePath, 'r', (err, fd) => {
              if (err) return console.error('Error opening file:', err);
              fs.read(fd, buffer, 0, readLength, this.lastReadPosition, (err, bytesRead) => {
                if (err) return console.error('Error reading file:', err);
                if (bytesRead > 0) {
                  const newContent = buffer.toString('utf8', 0, bytesRead);
                  const lines = (this.leftover + newContent).split('\n');
                  this.leftover = lines.pop(); // buffer incomplete line
                  lines.forEach(line => {
                    if (line) {
                      // interact with each complete line here
                      parser.readLine(line); // Call the parser's readLine method
                    }
                  });
                  this.lastReadPosition += bytesRead;
                }
                fs.close(fd, () => {});
              });
            });
          }
        });
      }
    });
  }
}

export default new LogReader()
