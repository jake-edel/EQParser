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
    return line.includes('You receive') && line.includes('as your split');
  }

  handleCoinReceive(line) {
    line = line
      .replace(',', '')
      .replace('You receive ', '')
      .replace(' as your split.', '')

    const platinum = line.match(/(\d+) platinum/) || [];
    const gold = line.match(/(\d+) gold/) || [];
    const silver = line.match(/(\d+) silver/) || [];
    const copper = line.match(/(\d+) copper/) || [];

    this.debug.log({ platinum, gold, silver, copper })

    // const [_, amount, type] = line.match(/(\d+) (platinum|gold|silver|copper)/) || [];
    // if (amount && type) {
    //   this.totalCash[type] += parseInt(amount, 10);
    //   this.debug.log(`Updated total cash: ${JSON.stringify(this.totalCash)}`);
    // }
  }
  
}

export default new Loot();