import File from "./File.ts";

class DebugFile extends File {
  constructor() {
    super('C:\\Users\\Jake\\Documents\\Code\\EQParser\\server\\data\\debug.log')
  }

  async write(line: string) {
    await this.open('a')
    await this.file.write(line + '\n')
    await this.close()
  }
}

export default new DebugFile()