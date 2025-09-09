import server from "../Server.ts"
import Debugger from "../Debugger.ts"
import playerCharacter from "../PlayerCharacter.ts"

class Chat {
  private readonly auctionPattern = /^(\w+) auctions, .+/i
  private readonly groupPattern = /^(\w+) tells the group, (.)+/i
  private readonly tellPattern = new RegExp(`^([\\w]+|${playerCharacter.name}) -> ([\\w]+|${playerCharacter.name}): (.*)`, 'i')
  
  private readonly debug = new Debugger(this.constructor.name).enable()

  isAuction(line) {
    return this.auctionPattern.test(line)
  }

  isGroup(line) {
    return this.groupPattern.test(line)
  }

  isTell(line) {
    return this.tellPattern.test(line)
  }

  auctionHandler(line) {
    server.send(line, 'auction')
  }

  groupHandler(line) {
    const match = this.groupPattern.exec(line)
    if (!match) return
    const partyMember = match[1]
    const message = match[2]
    server.send({ partyMember, message }, 'group')
  }

  tellHandler(line) {
    const match = this.tellPattern.exec(line)
    if (!match) return
    const sender = match[1]
    const recipient = match[2]
    const message = match[3]
    server.send({ sender, recipient, message }, 'tell')
  }
}

export default new Chat()