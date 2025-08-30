import fs from 'fs'
import fileService from './FileService.ts'
import Debugger from './Debugger.ts'

class LogFile {
  path = 'C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt'
  file: fs.promises.FileHandle
  debug = new Debugger(this.constructor.name)

  constructor(path) {
    this.path = path
  }

  async open() {
    this.debug.log('Opening log file')
    this.file = await fileService.openFile(this.path)
  }

  async size() {
    return fileService.getFileSize(this.path)
  }

  async close() {
    this.debug.log('Closing log file')
    await this.file?.close()
  }

  async read(position, length) {
    return fileService.readFile(this.file, length, position)
  }

  async readAll() {
    await this.open()
    const length = await this.size()
    const { buffer } = await this.read(0, length)
    await this.close()

    return buffer.toString()
  }
}

export default LogFile