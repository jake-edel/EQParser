import http from 'http';
import { WebSocketServer } from 'ws';

class Server {
  constructor() {
    this.httpServer = http.createServer();
    this.wsServer = null
  }

  start() {
    this.createWebSocketServer();
    this.startHttpServer();
  }

  createWebSocketServer() {
    this.wsServer = new WebSocketServer({ server: this.httpServer });

    this.wsServer.on('connection', (socket) => this.handleOnWsConnection(socket));
    this.wsServer.on('close', () => this.handleOnWsClose());
  }

  handleOnWsConnection(socket) {
    socket.send('Server says "Welcome to the server"');
    socket.on('message', (message) => {
      console.log(message.toString('utf-8'));
    });
  }

  handleOnWsClose() {
    this.send('Server closing connection');
  }

  startHttpServer() {
    this.httpServer.listen(4000, '0.0.0.0', () => {
      console.log('HTTP server listening on port 4000');
    });
  }

  send(data, key) {
    if (key) {
      const payload = { [key]: data };
      data = Buffer.from(JSON.stringify(payload));
    }
    this.wsServer.clients.forEach(client => {
      if (client.readyState === client.OPEN) client.send(data);
    });
    
  }
}

export default new Server();