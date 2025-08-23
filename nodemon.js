import nodemon from 'nodemon';
import http from 'http';
import { WebSocketServer } from 'ws';

const httpServer = http.createServer();

httpServer.listen(4001, () => {
  console.log('HTTP server listening on port 4001');
});

const wsServer = new WebSocketServer({ server: httpServer });
let socket;
let appStarted = false;
wsServer.on('connection', (newSocket) => {
  if (appStarted) return;
  console.log('New WebSocket connection');
  socket = newSocket;

  nodemon({
    script: 'app.js',
    verbose: true
  });

  nodemon.on('restart', (files) => {
    console.log('Nodemon restarted due to changes in: ', files);
    if (socket) socket.send('restart');
    
    appStarted = true;
  });
});



// nodemon({
//   script: 'app.js',
//   verbose: true
// });

// nodemon.on('restart', (files) => {
//   console.log('Nodemon restarted due to changes in: ', files);
//   if (socket) {
//     socket.send(JSON.stringify({ type: 'restart', files }));
//   }
// });