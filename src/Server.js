import http from 'http';
import { WebSocketServer } from 'ws';

class Server {
  constructor() {
    this.httpServer = http.createServer();
    this.socket = null;

    this.createWebSocketServer();
    this.startHttpServer();
  }

  createWebSocketServer() {
    const wsServer = new WebSocketServer({ server: this.httpServer });

    wsServer.on('connection', (socket) => this.handleOnWsConnection(socket));
    wsServer.on('close', () => this.handleOnWsClose());
  }

  handleOnWsConnection(socket) {
    // Once a WebSocket connection is established
    // expose the socket to any consuming classes
    this.socket = socket;
    console.log('Server: WebSocket connection established');
    this.socket.send('Server: WebSocket connection established');
    this.socket.on('message', (message) => {
      console.log(message.toString('utf-8'));
    });
  }

  handleOnWsClose() {
    this.socket.send('Server closing connection');
    this.socket = null;
  }

  startHttpServer() {
    this.httpServer.listen(4000, '0.0.0.0', () => {
      console.log('HTTP server listening on port 4000');
    });
  }

  send(data, key) {
    if (!this.socket) return
    if (!key) return this.socket.send(data);
    const payload = { [key]: data };
    const buffer = Buffer.from(JSON.stringify(payload));
    this.socket.send(buffer);
  }
}

export default new Server();