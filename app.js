import LogWatcher from './src/LogWatcher.js';
import server from './src/Server.js';

server.start();

new LogWatcher().startWatchingLog();
