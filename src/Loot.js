import Debugger from './Debugger.js';
class Loot {
  constructor() {
    this.debug = new Debugger(this.constructor.name);
    this.totalCash = {
      platinum: 0,
      gold: 0,
      silver: 0,
      copper: 0
    }

    this.debug.enable()
  }

  isCoinReceive(line) {
    const isCoinReceive = line.includes('You receive');
    if (isCoinReceive) this.debug.log('Coin receive detected');
    return isCoinReceive;
  }

  handleCoinReceive(line) {
    const [_, amount, type] = line.match(/You receive (\d+) (platinum|gold|silver|copper)/) || [];
    if (amount && type) {
      this.totalCash[type] += parseInt(amount, 10);
      this.debug.log(`Updated total cash: ${JSON.stringify(this.totalCash)}`);
    }
  }
  
}

export default new Loot();