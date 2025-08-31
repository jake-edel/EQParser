import Character from "./Character.ts";
import characterFile from "./files/CharacterFile.ts";

class PlayerCharacter extends Character {
    async get() {
      const { charName, level, race, charClass } = await characterFile.getCharacterInfo()
      this.name = charName
      this.level = level
      this.race = race
      this.charClass = charClass

      return this
    }
}

export default await new PlayerCharacter().get()
