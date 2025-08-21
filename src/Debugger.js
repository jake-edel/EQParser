import webSocket from "./WebSocket.js";

class Debugger {
  constructor(className) {
    this.enabledClasses = new Set();
    this.className = className;
    this.isDashboardMode = process.argv[2] === 'dashboard';
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
    if (this.isDashboardMode) return;
    
    if (this.enabledClasses.has(this.className)) {
      const debugString = `[${this.className}] => ${args.join(' ')}`;
      console.log(debugString);
      webSocket.send('debug', debugString);
    }
  }
}

export default Debugger;