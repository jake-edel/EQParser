import http from 'node:http';
import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';

class Server {
  httpServer: http.Server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify('gameState'));
  });
  wsServer: WebSocketServer | null = null;

  start(): void {
    this.createWebSocketServer();
    this.startHttpServer();
  }

  createWebSocketServer(): void {
    this.wsServer = new WebSocketServer({ server: this.httpServer });

    this.wsServer.on('connection', (socket: WebSocket) => this.handleOnWsConnection(socket));
    this.wsServer.on('close', () => this.handleOnWsClose());
  }

  handleOnWsConnection(socket: WebSocket): void {
    socket.send('Server says "Welcome to the server"');
    socket.on('message', (message: WebSocket) => {
      console.log(message.toString());
    });
  }

  handleOnWsClose(): void {
    this.send('Server closing connection');
  }

  startHttpServer(): void {
    this.httpServer.listen(4000, '0.0.0.0', () => {
      console.log('HTTP server listening on port 4000');
    });
  }

  send(data: any, key?: string): void {
    if (key) {
      const payload = { [key]: data };
      data = Buffer.from(JSON.stringify(payload));
    }
    this.wsServer?.clients?.forEach(client => {
      if (client.readyState === client.OPEN) client.send(data);
    });
    
  }
}

export default new Server();