import Debugger from './Debugger.js';
import server from './Server.js';
class Loot {
  constructor() {
    this.debug = new Debugger(this.constructor.name);
    this.totalCoins = {
      platinum: 0,
      gold: 0,
      silver: 0,
      copper: 0
    }

    this.debug.enable()
  }

  isCoinReceive(line) {
    return line.includes('You receive') && line.includes('as your split');
  }

  handleCoinReceive(line) {
    const coinsReceived = line.match(/(\d+) (platinum|gold|silver|copper)/g) || [];
    const coins = {};
    for (const coin of coinsReceived) {
      const [amount, type] = coin.split(' ')
      coins[type] = parseInt(amount, 10);
      this.totalCoins[type] += parseInt(amount, 10);
    }

    const payload = {
      total: this.totalCoins,
      received: coins
    }

    server.send(payload, 'coinLoot')
  }
  
}

export default new Loot();