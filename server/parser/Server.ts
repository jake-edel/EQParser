import http from 'node:http';
import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';

class Server {
  httpServer: http.Server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify('gameState'));
  });
  wsServer: WebSocketServer | null = null;
  connectionHandlers: Function[] = []

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
    console.log('Client connection established')
    this.connectionHandlers.forEach(fnc => fnc(socket))
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

  formatBuffer(data: any, key?: string | undefined): Buffer | string {
    if (key) {
      const payload = { [key]: data };
      data = Buffer.from(JSON.stringify(payload));
    }
    return data
  }

  send(data: any, key?: string | undefined): void {
    data = this.formatBuffer(data, key)
    this.wsServer?.clients?.forEach(client => {
      if (client.readyState === client.OPEN) client.send(data);
    });
    
  }
}

export default new Server();