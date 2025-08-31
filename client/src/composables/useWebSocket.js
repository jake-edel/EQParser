import { reactive } from 'vue'

const serverPort = 4000;
const socketAddress = `ws://${import.meta.env.VITE_HOST_IP}:${serverPort}/ws`;

const socketListeners = reactive({})

export default function useWebSocket(listeners = []) {
  listeners.forEach(listener => {
    Object.entries(listener).forEach(([key, handler]) => {
      if (!socketListeners[key]) { socketListeners[key] = [] };
      socketListeners[key].push(handler);
    })
  })

  let websocket;

  function startWebSocketService() {
    console.log('Begin polling for WebSocket Connection');
    createWebSocket();
    setTimeout(() => {
      // If that connection does not open up
      // within 3 seconds, begin retry loop
      if (websocket.readyState !== WebSocket.OPEN) {
        websocket.close()
        handleWebSocketRetry()
      }
    }, 3000)
  }

  function createWebSocket() {
    websocket = new WebSocket(socketAddress);
    websocket.onopen = () => {
      console.log('WebSocket connection established')
      attachWsHandlers(websocket)
    };

    return websocket;
  }

  function attachWsHandlers(websocket) {
    websocket.onmessage = (event) => onWebSocketMessage(event);
    websocket.onclose = onWebSocketClose;
  }
  
  function handleWebSocketRetry() {
    // Immediately start up a new connection
    createWebSocket()
    // Start our retry loop
    const interval = setInterval(async () => {
      // If the connection is made within 5 seconds
      // cancel the loop, attach the handlers, move along
      if (websocket?.readyState === WebSocket.OPEN) {
        clearInterval(interval);
        attachWsHandlers(websocket)
        return;
      }
      // Otherwise, close the existing attempt and start a new one
      console.log('Attempting to re-connect...');
      await websocket.close()
      websocket = new WebSocket(socketAddress);
      // Immediately attach the message handler
      // so we can start receiving messages as soon as the connection is made
      // Don't attach the close handler until the connection is made
      // to prevent a hell loop when websocket.close() spawns new
      // timeout loops.
      websocket.onmessage = onWebSocketMessage
    }, 3000);
  }
  
  function onWebSocketClose() {
    console.log('Connection closed')
    handleWebSocketRetry()
  }

  async function onWebSocketMessage(event) {
    if (typeof event.data === 'string') {
      console.log('Received message:', event.data);
      return;
    }

    const data = JSON.parse(await event.data.text());
    console.log(data);
    Object.keys(data).forEach(key => {
      const message = data[key]
      socketListeners[key]?.forEach(handler => handler(message))
    });
  };

  return {
    startWebSocketService
  }
}