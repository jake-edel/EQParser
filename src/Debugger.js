import server from "./Server.js";

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
      const classId = this.className ? `[${this.className}] => ` : '';
      const debugString = classId + args.join(' ');
      console.log(debugString);
      server.send(debugString, 'debug');
    }
  }
}

export default Debugger;