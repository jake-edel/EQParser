    const serverPort = 4000
    const ws = new WebSocket(`ws://172.21.144.1:${serverPort}/ws`); // Desktop
    // const ws = new WebSocket(`ws://192.168.1.79:${serverPort}/ws`); // Toshiba Laptop

    ws.onclose = () => {
      console.log('Client sees WebSocket connection closed');
    };

    ws.onmessage = event => {
      if (typeof event.data === 'string') {
        console.log(event.data)
        if (event.data === 'spellInterrupt') console.log('Spell was interrupted');
        return
      }

      event.data.text().then(text => {
        const message = JSON.parse(text);
        const keys = Object.keys(message);
        keys.forEach(key => {
          if (key === 'location') handleLocation(message[key]);
          if (key === 'debug') handleDebug(message[key]);
          if (key === 'log') handleLog(message[key]);
          if (key === 'compassDirection') handleCompassDirection(message[key]);
          if (key === 'petName') handlePetName(message[key]);
          if (key === 'petStatus') handlePetStatus(message[key]);
          if (key === 'coinLoot') handleCoinLoot(message[key]);
        });
      });
    }
    function handleDebug(debugMessage) {
      const id = 'debug';
      const innerText = `${debugMessage}`;
      const element = createElement(id, innerText);
      document.getElementById('debug').prepend(element);
    }

    function handleLog(logMessage) {
      const id = 'log';
      const innerText = `${logMessage}`;
      const element = createElement(id, innerText);
      document.getElementById('log').prepend(element);
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

    function createElement(id, innerText) {
      const element = document.createElement('div');
      element.id = id;
      element.innerText = innerText;
      return element;
    }