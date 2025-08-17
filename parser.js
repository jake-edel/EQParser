import fs from 'fs'
class Parser {
  constructor() {
    this.filePath = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt';
    this.lastReadPosition = 0;
    this.testFilePath = './testlog';
    this.fullLog = [];
    this.logLineCount = 0;
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

  async startFileWatcher() {
    const fileStats = await fs.promises.stat(this.filePath);
    this.lastReadPosition = fileStats.size;
    
    fs.watch(this.filePath, eventType => {
      if (eventType === 'change') {
        setTimeout(() => {
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
                    console.log(newContent.replace(/\n/g, ''));
                    this.lastReadPosition += bytesRead;
                  }
                  fs.close(fd, () => {});
                });
              });
            }
          });
        }, 50);
      }
    });
  }
}

export default new Parser()
