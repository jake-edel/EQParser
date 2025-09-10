export type PlayerInfo = {
  charName: string
  level: number
  race: string
  charClass: string
}

export type SocketHandler = (payload: PlayerInfo) => void;
export type Listener = Record<string, SocketHandler>
export type SocketListeners = Record<string, SocketHandler[]>