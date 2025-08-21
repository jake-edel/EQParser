import webSocket from "./WebSocket.js";

class Debugger {
  constructor(className) {
    this.enabledClasses = new Set();
    this.className = className;
  }

  enable() {
    this.enabledClasses.add(this.className);
    return this;
  }

  disable() {
    this.enabledClasses.delete(this.className);
    return this;
  }

  log(...args) {
    if (this.enabledClasses.has(this.className)) {
      const debugString = `[${this.className}] => ${args.join(' ')}`;
      console.log(debugString);
      webSocket.send('debug', debugString);
    }
  }
}

export default Debugger;