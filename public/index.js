    const serverPort = 4000
    const ws = new WebSocket(`ws://192.168.1.79:${serverPort}`);

    ws.onmessage = event => {
      if (typeof event.data === 'string') {
        console.log(event.data);
        return
      }

      event.data.text().then(text => {
        const message = JSON.parse(text);
        const keys = Object.keys(message);
        keys.forEach(key => {
          if (key === 'location') handleLocation(message[key]);
          if (key === 'debug') handleDebug(message[key]);
          if (key === 'compassDirection') handleCompassDirection(message[key]);
          if (key === 'petName') handlePetName(message[key]);
          if (key === 'petStatus') handlePetStatus(message[key]);
        });
      });
    }
    function handleDebug(debugMessage) {
      const id = 'debug';
      const innerText = `${debugMessage}`;
      const element = createElement(id, innerText);
      document.getElementById('dashboard').prepend(element);
    }

    function handleLocation(location) {
      const innerText = `X: ${location.x}, Y: ${location.y}`;
      document.getElementById('location').innerText = innerText;
    }

    function handleCompassDirection(direction) {
      document.getElementById('compassDirection').innerText = direction;
    }

    function handlePetName(petName) {
      document.getElementById('petName').innerText = petName;
    }

    function handlePetStatus(petStatus) {
      document.getElementById('petStatus').innerText = petStatus;
    }

    function createElement(id, innerText) {
      const element = document.createElement('div');
      element.id = id;
      element.innerText = innerText;
      return element;
    }