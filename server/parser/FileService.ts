import fs from 'fs'
import Debugger from './Debugger.ts'

class FileService {
  debug = new Debugger(this.constructor.name).enable()

  async getFileSize(filePath): Promise<number> {
    try {
      return (await fs.promises.stat(filePath)).size;
    } catch (error) {
      this.debug.log('Error getting log size:', error);
    }
    return 0
  }

  async openFile(filePath): Promise<fs.promises.FileHandle> {
    try {
      return await fs.promises.open(filePath, 'r');
    } catch (error) {
      this.debug.log('Error opening file:', error);
    }
    throw new Error('Unable to read file at', filePath)
  }

  async readFile(file:fs.promises.FileHandle, readLength: number, position: number): Promise<fs.promises.FileReadResult<Buffer<ArrayBuffer>>> {
    try {
      this.debug.log('Getting ready to read', readLength, 'new bytes');
      const result = await file.read(Buffer.alloc(readLength), 0, readLength, position)
    
      if (result.bytesRead <= 0) this.debug.log('No data read from file')

      return result
    } catch (error) {
      this.debug.log('Error reading file:', error);
    }

    return { buffer: Buffer.alloc(0), bytesRead: 0 }
  }

}

export default new FileService()
