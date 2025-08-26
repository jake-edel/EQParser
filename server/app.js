import LogWatcher from './parser/LogWatcher.js';
import server from './parser/Server.js';

server.start();

new LogWatcher().startWatchingLog();
