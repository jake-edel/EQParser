import server from "./Server.ts"
import Debugger from "./Debugger.ts"

class Chat {
  auctionPattern = /^(\w+) auctions, .+/i
  debug = new Debugger(this.constructor.name).enable()

  isAuction(line) {
    return this.auctionPattern.test(line)
  }

  auctionHandler(line) {
    server.send(line, 'auction')
  }

}

export default new Chat()