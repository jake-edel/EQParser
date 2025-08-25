import Debugger from "./Debugger.js";
import server from "./Server.js";
import stripTimestamp from "./utils/stripTimestamp.js";

class Camping {
  constructor() {
    this.debug = new Debugger(this.constructor.name);
    this.debug.enable();
    this.campingMessage = /^it will take (?:you )?about (\d+) (?:more )?seconds to prepare your camp\.$/i;
  }

  handleMakeCamp(line) {
    line = stripTimestamp(line);

    if (this.isAbandonCamp(line)) {
      server.send('abandon', 'camping');
      return;
    }

    if (this.isCampingMessage(line)) {
      const secondsToCamp = line.match(this.campingMessage)[1];
      server.send(secondsToCamp, 'camping')
    }
  }
  
  isAbandonCamp(line) {
    return line.includes('You abandon your preparations to camp.');
  }
  
  isPreparingToCamp(line) {
    return this.campingMessage.test(stripTimestamp(line));
  }

  isCampingMessage(line) {
    line = stripTimestamp(line);
    return this.isPreparingToCamp(line) || this.isAbandonCamp(line);
  }
}

export default new Camping();
