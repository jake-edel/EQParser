import { reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const socketListeners = reactive({})

export default function useWebSocket(listeners) {
  const host = '192.168.1.79';
  // const host = '192.168.1.72';
  const serverPort = 4000;
  const socketAddress = `ws://${host}:${serverPort}/ws`;

  let websocket;
  function createWebSocket() {
    websocket = new WebSocket(socketAddress);
    websocket.onopen = () => console.log('WebSocket connection established');
    return websocket;
  }
  
  function handleWebSocketRetry() {
    const interval = setInterval(() => {
      if (websocket?.readyState === WebSocket.OPEN) {
        clearInterval(interval);
        attachWsHandlers(websocket);
        return;
      }
      websocket = createWebSocket();
      console.log('Attempting to connect...');
    }, 2000);
  }
  
  function attachWsHandlers(websocket) {
    websocket.onclose = () => onWebSocketClose();
    websocket.onmessage = (event) => onWebSocketMessage(event);
  }

    const onWebSocketClose = () => {
    console.log('WebSocket connection closed');
    handleWebSocketRetry();
  }

  listeners.forEach(listener => socketListeners[listener.key] = listener.handler)
  async function onWebSocketMessage(event) {
    if (typeof event.data === 'string') {
      console.log('Received message:', event.data);
      return;
    }

    const data = JSON.parse(await event.data.text());
    console.log(data);
    Object.keys(data).forEach(key => {
      const message = data[key]
      socketListeners[key]?.(message)
    });
  };

  function startWebSocketService() {
    console.log('Begin polling for WebSocket Connection');
    handleWebSocketRetry();
  }

  return {
    startWebSocketService
  }
}