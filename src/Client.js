import express from 'express'
import http from 'http';
import { WebSocketServer } from 'ws';

class Client {
  constructor() {
    // Create an http server to listen to requests
    // and use as the basis for the WebSocket and Express servers
    const app = express();
    const httpServer = http.createServer(app);
    this.wsServer = new WebSocketServer({ server: httpServer });
    
    // Configure the Express server to serve up the front end
    // from the 'public' directory
    app.use(express.static('public'));
    httpServer.listen(4000, '0.0.0.0', () => {
      console.log('HTTP server listening on port 4000');
    });

    // Set up a WebSocket connection with the client
    this.socket = null;
    this.wsServer.on('connection', socket => {
      this.socket = socket;
      this.socket.send('Hello from the server!');
    });
  }

  send(key, data) {
    if (!this.socket) return
    const payload = { [key]: data };
    const buffer = Buffer.from(JSON.stringify(payload));
    this.socket.send(buffer);
  }
}

export default new Client();