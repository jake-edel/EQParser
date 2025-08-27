import server from "./Server.js";

class Debugger {
  enabledClasses = new Set<string>()
  className: string

  constructor(className: string) {
    this.className = className;
  }

  enable() {
    this.enabledClasses.add(this.className);
    return this;
  }

  log(...args) {    
    if (this.enabledClasses.has(this.className)) {
      const classId = this.className ? `[${this.className}] => ` : '';
      const debugString = classId + args.join(' ');
      console.log(debugString);
      server.send(debugString, 'debug');
    }
  }
}

export default Debugger;