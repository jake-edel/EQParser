import LogWatcher from './src/LogWatcher.js';
import Parser from './src/Parser.js';
import { WebSocketServer } from 'ws';

const dashboardMode = process.argv[2] === 'dashboard';

const parser = new Parser({ dashboardMode });
const logWatcher = new LogWatcher(parser);

await logWatcher.startWatchingLog();

parser.beginParsing();

const server = new WebSocketServer({ port: 4000 });

server.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('message', (message) => {
    console.log('Received:', message.toString('utf8'));
  });
  socket.send('Hello from the server!');
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});
