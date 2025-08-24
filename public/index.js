    const host = '192.168.1.79'
    const serverPort = 4000
    const socketAddress = `ws://${host}:${serverPort}/ws`;
    let ws = new WebSocket(socketAddress);

    ws.onclose = () => {
      console.log('Client: WebSocket connection closed');
      setTimeout(() => { // TODO: Do better, works for now
        console.log('Client: Reconnecting...');
        ws = new WebSocket(socketAddress);
      }, 1000);
    };

    ws.onopen = () => {
      console.log('Client: WebSocket connection established');
      ws.send('Hello from the client');
    };

    ws.onmessage = event => {
      if (typeof event.data === 'string') {
        console.log(event.data)
        if (event.data === 'spellInterrupt') console.log('Spell was interrupted');
        return
      }

      event.data.text().then(text => {
        const message = JSON.parse(text);
        console.log(message);
        const keys = Object.keys(message);
        keys.forEach(key => {
          if (key === 'location') handleLocation(message[key]);
          if (key === 'debug') handleDebug(message[key]);
          if (key === 'log') handleRawLog(message[key]);
          if (key === 'compassDirection') handleCompassDirection(message[key]);
          if (key === 'petName') handlePetName(message[key]);
          if (key === 'petStatus') handlePetStatus(message[key]);
          if (key === 'coinLoot') handleCoinLoot(message[key]);
          if (key === 'zone') handleZoneChange(message[key]);
        });
      });
    }

    function createElement(id, innerText) {
      const element = document.createElement('div');
      element.id = id;
      element.innerText = innerText;
      return element;
    }

    function handleTextLog(id, message) {
      const innerText = `${message}`;
      const element = createElement(id, innerText);
      document.getElementById(id).prepend(element);
    };

    function handleDebug(debugMessage) {
      handleTextLog('debug', debugMessage);
    }

    function handleRawLog(logMessage) {
      handleTextLog('log', logMessage);
    }

    function handleCoinLoot(coins) {
      Object.entries(coins.total).forEach(([type, amount]) => {
        updateElementById(`total-coin-${type}`, `Total ${type}: ${amount}`);
      });
      Object.entries(coins.received).forEach(([type, amount]) => {
        updateElementById(`coin-${type}`, `Total ${type}: ${amount}`);
      });
      setTimeout(() => {
        for (const type of ['copper', 'silver', 'gold', 'platinum']) {
          updateElementById(`coin-${type}`, `Total ${type}: 0`);
        }
      }, 4000);
    }

    function updateElementById(id, innerText) {
      document.getElementById(id).innerText = innerText;
    }

    function handleLocation(location) {
      const innerText = `X: ${location.x}, Y: ${location.y}`;
      document.getElementById('location').innerText = innerText;
    }

    function handleCompassDirection(direction) {
      updateElementById('compassDirection', direction);
    }

    function handlePetName(petName) {
      updateElementById('petName', petName);
    }

    function handlePetStatus(petStatus) {
      updateElementById('petStatus', petStatus);
    }

    function handleZoneChange(zoneName) {
      updateElementById('zone', zoneName);
    }
