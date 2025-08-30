import File from './File.ts'
class LogFile extends File {
  constructor() {
    super('C:\\Everquest\\Logs\\eqlog_Jakxitz_P1999Green.txt')
  }
}

export default new LogFile()