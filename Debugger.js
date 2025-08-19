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
      console.log(`[${this.className}] =>`, ...args);
    }
  }
}

export default Debugger;