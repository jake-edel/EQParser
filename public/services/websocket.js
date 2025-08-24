    const host = '192.168.1.79'
    const serverPort = 4000
    const socketAddress = `ws://${host}:${serverPort}/ws`;

    function createWebSocket() {
      const ws = new WebSocket(socketAddress);
      ws.onclose = () => retryWebSocketReconnect();
      ws.onopen = () => handleWsOpen();
      ws.onmessage = event => handleWsMessage(event);
      return ws;
    }


    function retryWebSocketReconnect () {
      console.log('Client: WebSocket connection closed. Attempting to reconnect...');
      createWebSocket();
    }


    function handleWsOpen() {
      console.log('Client: WebSocket connection established');
    }

    function handleWsMessage(event) {
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

    createWebSocket()