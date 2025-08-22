    const serverPort = 4000
    const ws = new WebSocket(`ws://localhost:${serverPort}`);

    ws.onopen = () => {
      console.log(`WebSocket connection established with port ${serverPort}`);
      ws.send('Hello from the client!');
    };
    
    ws.onmessage = event => {
      console.log(event)
      // If we're getting a string back from the server
      // handle it as is, no buffer to deal with
      if (typeof event.data === 'string') {
        console.log(event.data);
        return
      }

      event.data.text().then(text => {
        console.log(JSON.parse(text));
        const message = JSON.parse(text);
        const keys = Object.keys(message);
        keys.forEach(key => {
          if (key === 'location') handleLocation(message[key]);
          if (key === 'debug') handleDebug(message[key]);
        });
      });
    }
    function handleDebug(debugMessage) {
      const id = 'debug';
      const innerText = `Debug: ${debugMessage}`;
      const element = createElement(id, innerText);
      document.getElementById('dashboard').prepend(element);
    }

    function handleLocation(location) {
      const id = 'location';
      const innerText = `Location - X: ${location.x}, Y: ${location.y}, Z: ${location.z}`;
      document.getElementById('location').innerText = innerText;
    }

    function createElement(id, innerText) {
      const element = document.createElement('div');
      element.id = id;
      element.innerText = innerText;
      return element;
    }