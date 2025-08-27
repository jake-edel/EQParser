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
      // Close previous connection before attempting another
      if (websocket) websocket.close()
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

  function startWebSocketService() {
    console.log('Begin polling for WebSocket Connection');
    handleWebSocketRetry();
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