import { WebSocketServer } from 'ws';

class WebSocket {
  constructor() {
    this.server = new WebSocketServer({ port: 4000 });
    this.socket = null;
    this.client = null

    this.server.on('connection', socket => {
      this.socket = socket;
      this.client = this.server.clients[0];

    });
  }

  send(key, data) {
    if (!this.socket) return
    const payload = { [key]: data };
    const buffer = Buffer.from(JSON.stringify(payload));
    this.socket.send(buffer);
  }
}

export default new WebSocket();