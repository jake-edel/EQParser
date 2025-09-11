export type Coin = 'platinum' | 'gold' | 'silver' | 'copper'

export type CoinQuantity = Record<Coin, number>

export interface CoinLoot {
  received: CoinQuantity,
  total: CoinQuantity
}

export interface PlayerInfo {
  charName: string
  level: number
  race: string
  charClass: string
}

// interface EventPayloads {
//   playerInfo: PlayerInfo
//   coinLoot: CoinLoot
// }

export type SocketHandler = (payload: PlayerInfo | CoinLoot ) => void;
export type Listener = Record<string, SocketHandler>
export type SocketListeners = Record<string, SocketHandler[]>