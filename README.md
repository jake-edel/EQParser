# EQ Log Parser
### A log parser and dashboard for EQ in-game data

#### The Log Parser (Server) - Node + Typescript
The [LogWatcher](./server/parser/LogWatcher.js) sets up a file watcher on the EQ log file, which fires an event each time the log is written to. The line is then read and passed to the [Parser](./server/parser/Parser.js), which registers a number of handlers inside [parseRegistry.js](./server/utils/parseRegistry.js). This registry sets up conditions to determine how a given line should be handled. The line is then sent to a module to be formatted. Finally, the application starts a websocket server, which will emit these log events to the client.

#### The Dashboard (Client) - Vue + Typescript (planned)
The client is a SPA which sets up a [websocket connection](./client/src/composables/useWebSocket.js) with the server and begins to listen to events from the server. Each event is a key-value pair, the key defining the type of event and the value being the event data. The various consuming components in the application then define the type of event they wish to listen for, and a handler for this event. The component will then modify and present the data on the UI

Intended / possible features:
- Location data - X,Y location, cardinal direction, current zone, maps
- Pet information
- Spell data - cast times, effect timers
- Loot data - coin tally, item pickups
- P99 Wiki integration
- Chat / spell notifications
- Rest API for handling stored data
- Database for persisting data across sessions

Todos:
- ~~Update logic for websocket reconnects~~
- ~~Support multiple simultaneous clients~~
- More robust string matching via regex/regex matching groups - WIP
- ~~Spell + buff timers~~
- ~~Filtered chat groups~~
- Camping notifications
- handle /who
- ~~persistent storage of character data (/who - name level class race)~~
- ~~search log for current zone~~
- make UI nice
- ~~backend stores model of game state and can be requested by front end (app load/reload)~~
- Vue Typescript