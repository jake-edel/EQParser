import { reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const socketListeners = reactive([])
export default function useWebSocket(listeners) {
  const host = '192.168.1.79';
  // const host = '192.168.1.72';
  const serverPort = 4000;
  const socketAddress = `ws://${host}:${serverPort}/ws`;
  
  let ws;
  function handleWebSocketRetry() {
    const interval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        clearInterval(interval);
        attachWsHandlers(ws);
        return;
      }
      ws = createWebSocket();
      console.log('Attempting to connect...');
    }, 2000);
  }

  function createWebSocket() {
    ws = new WebSocket(socketAddress);
    ws.onopen = () => console.log('WebSocket connection established');
    return ws;
  }
  
  function startWebSocketService() {
    console.log('Begin polling for WebSocket Connection');
    handleWebSocketRetry();
  }
  
  socketListeners.push(...listeners)
  function attachWsHandlers(ws) {
    ws.onclose = () => onWebSocketClose();
    ws.onmessage = async (event) => {

      if (typeof event.data === 'string') {
        console.log('Received message:', event.data);
        return;
      }

      const data = JSON.parse(await event.data.text());
      socketListeners.forEach((listener) => {
        Object.keys(data).forEach(key => {
          const message = data[key]
          if (key === listener.key) listener.handler(message)
        });
      });
    };
  }

  const onWebSocketClose = () => {
    console.log('WebSocket connection closed');
    handleWebSocketRetry();
  }

  return {
    startWebSocketService
  }
}