    function createElement(innerText) {
      const element = document.createElement('div');
      element.innerText = innerText;
      return element;
    }

    function handleTextLog(id, message) {
      const innerText = `${message}`;
      const element = createElement(innerText);
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
