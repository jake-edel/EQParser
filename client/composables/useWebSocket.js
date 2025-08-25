export default function useWebSocket({ handleWebSocketMessage }) {
  const host = "192.168.1.79";
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
      console.log(ws)
      console.log("Attempting to connect...");
    }, 2000);
  }
  
  function createWebSocket() {
    ws = new WebSocket(socketAddress);
    ws.onopen = () => console.log("WebSocket connection established");
    return ws;
  }
  
  function startWebSocketService() {
    console.log("Begin polling for WebSocket Connection");
    handleWebSocketRetry();
  }
  
  function attachWsHandlers(ws) {
    ws.onclose = () => onWebSocketClose();
    ws.onmessage = (event) => handleWebSocketMessage(event);
  }

  const onWebSocketClose = () => {
    console.log("WebSocket connection closed");
    handleWebSocketRetry();
  }

  return {
    startWebSocketService
  }
}