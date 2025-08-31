import server from "../Server.ts"
import Debugger from "../Debugger.ts"

class Chat {
  private readonly auctionPattern = /^(\w+) auctions, .+/i
  private readonly debug = new Debugger(this.constructor.name).enable()

  isAuction(line) {
    return this.auctionPattern.test(line)
  }

  auctionHandler(line) {
    server.send(line, 'auction')
  }

}

export default new Chat()