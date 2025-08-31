import fs from 'fs'
import Debugger from '../Debugger.ts'

class File {
  readonly path: string
  private file: fs.promises.FileHandle
  private readonly debug = new Debugger(this.constructor.name)

  constructor(path) {
    this.path = path
  }

  async size(): Promise<number> {
    try {
      return (await fs.promises.stat(this.path)).size;
    } catch (error) {
      this.debug.log('Error getting log size:', error);
    }
    return 0
  }

  async open(): Promise<fs.promises.FileHandle> {
    this.debug.log('Opening log file')
    try {
      this.file = await fs.promises.open(this.path, 'r')
      return this.file;
    } catch (error) {
      this.debug.log('Error opening file:', error);
    }
    throw new Error('Unable to read file at' + this.path)
  }

  async read(position: number, readLength: number): Promise<fs.promises.FileReadResult<Buffer<ArrayBuffer>>> {
    try {
      this.debug.log('Getting ready to read', readLength, 'new bytes');
      const result = await this.file.read(Buffer.alloc(readLength), 0, readLength, position)
    
      if (result.bytesRead <= 0) this.debug.log('No data read from file')

      return result
    } catch (error) {
      this.debug.log('Error reading file:', error);
    }

    return { buffer: Buffer.alloc(0), bytesRead: 0 }
  }

  async readAll() {
    await this.open()
    const fileLength = await this.size()
    const { buffer } = await this.read(0, fileLength)
    await this.close()

    return buffer.toString()
  }

  async close() {
    this.debug.log('Closing log file')
    await this.file?.close()
  }

}

export default File
