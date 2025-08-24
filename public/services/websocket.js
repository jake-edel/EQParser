    const host = '192.168.1.79'
    const serverPort = 4000
    const socketAddress = `ws://${host}:${serverPort}/ws`;

    let ws;
    function createWebSocket() {
      ws = new WebSocket(socketAddress);
      ws.onopen = () => handleWsOpen();
      return ws;
    }

    console.log('Begin polling for WebSocket Connection')
    handleWebSocketRetry()

    function attachWsHandlers (ws) {
      ws.onclose = () => handleOnWsConnectionClose();
      ws.onmessage = event => handleWsMessage(event);
    }

    function handleOnWsConnectionClose() {
      console.log('WebSocket connection closed');
      handleWebSocketRetry();
    }

    function handleWebSocketRetry () {
      const interval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          attachWsHandlers(ws);
          return;
        }
      ws = createWebSocket();
        console.log('Attempting to connect...')
      }, 2000);
    }

    function handleWsOpen() {
      console.log('WebSocket connection established');
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

