import File from "./File.ts";

class CharacterFile extends File {
  constructor() {
    super ('C:\\Users\\Jake\\Documents\\Code\\EQParser\\server\\data\\charInfo.csv')
  }

  async getCharacterInfo() {
    const data = (await this.readAll()).split('|')
    const [charName, level, race, charClass]: Array<string> = data

    return { charName, level, race, charClass }
  }
}

export default new CharacterFile()