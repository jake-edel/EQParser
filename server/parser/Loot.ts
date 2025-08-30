import Debugger from './Debugger.ts';
import gameState from './GameState.ts';
import type { CoinQuantity } from '../types/types';
class Loot {
  debug = new Debugger(this.constructor.name).enable()
  coinReceiveRegExp = /You receive (\d+) (platinum|gold|silver|copper)+./g
  totalCoins: CoinQuantity = {
      platinum: 0,
      gold: 0,
      silver: 0,
      copper: 0
  }

  isCoinReceive(line: string): boolean {
    return this.coinReceiveRegExp.test(line)
  }

  handleCoinReceive(line: string): void {
    const coinsReceived = line.match(/(\d+) (platinum|gold|silver|copper)/g) || [];
    const coins = {};
    this.debug.log('Coins received: ', coinsReceived)
    for (const coin of coinsReceived) {
      const [amount, type] = coin.split(' ')
      coins[type] = parseInt(amount, 10);
      this.totalCoins[type] += parseInt(amount, 10);
    }

    const payload = {
      total: this.totalCoins,
      received: coins
    }

    gameState.set('coinLoot', payload)
  }
  
}

export default new Loot();