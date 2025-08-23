import http from 'http';
import { WebSocketServer } from 'ws';

class Server {
  constructor() {
    const httpServer = http.createServer();
    const wsServer = new WebSocketServer({ server: httpServer });
    
    httpServer.listen(4000, '0.0.0.0', () => {
      console.log('HTTP server listening on port 4000');
    });

    this.socket = null;
    // Once a WebSocket connection is established
    // expose the socket to any consuming classes
    wsServer.on('connection', socket => { this.socket = socket });

    wsServer.on('close', () => { this.socket.send('Server closing connection') })
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