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
    console.log('[WebSocket] => WebSocket server started on port 4000');
  }

  send(data) {
    console.log(`[WebSocket] => Sending data: ${data}`);
    if (this.socket) this.socket.send(data);
  }
}

export default new WebSocket();