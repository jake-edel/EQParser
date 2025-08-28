import LogWatcher from './parser/LogWatcher.ts';
import server from './parser/Server.ts';

server.start();

new LogWatcher().startWatchingLog();
