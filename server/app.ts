import LogWatcher from './parser/LogWatcher.ts';
import server from './parser/Server.ts';
import location from './parser/modules/Location.ts';

server.start();

await new LogWatcher().startWatchingLog();

await location.searchForCurrentZone()