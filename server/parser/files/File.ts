import fs from 'fs'
// import Debugger from '../Debugger.ts'

class File {
  readonly path: string
  protected file: fs.promises.FileHandle
  // private readonly debug = new Debugger(this.constructor.name)

  constructor(path) {
    this.path = path
  }

  async size(): Promise<number> {
    try {
      return (await fs.promises.stat(this.path)).size;
    } catch (error) {
      console.error('Error getting log size:', error);
    }
    return 0
  }

  async open(permissions = 'r'): Promise<void> {
    try {
      this.file = await fs.promises.open(this.path, permissions)
    } catch (error) {
      console.error('Error opening file:', error);
    }
  }

  async read(position: number, readLength: number): Promise<fs.promises.FileReadResult<Buffer<ArrayBuffer>>> {
    try {
      const result = await this.file.read(Buffer.alloc(readLength), 0, readLength, position)
    
      if (result.bytesRead <= 0) console.error('No data read from file')

      return result
    } catch (error) {
      console.error('Error reading file:', error);
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
    await this.file?.close()
  }

}

export default File
