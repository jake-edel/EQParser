import server from "./Server.ts";
import debugFile from "./files/DebugFile.ts"

class Debugger {
  private readonly enabledClasses = new Set<string>()
  private readonly className: string

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

  write(...args: string[]) {
    debugFile.write(args.join(' '))
  }
}

export default Debugger;