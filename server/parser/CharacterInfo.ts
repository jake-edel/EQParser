import FileService from "./FileService.ts"
import LogFile from './LogFile.ts'

class CharacterInfo {
  name = ''
  level = ''
  race = ''
  class = ''
  filePath = 'C:\\Users\\Jake\\Documents\\Code\\EQParser\\server\\data\\charInfo.csv'
  charFile = new LogFile(this.filePath)

  async get() {
    const data = (await this.charFile.readAll()).split('|')
    console.log(data)
    const [charName, level, race, charClass]: Array<string> = data
    console.log({charName, level, race, charClass})
    
  }
}

new CharacterInfo().get()