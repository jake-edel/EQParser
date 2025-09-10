import { ref, reactive } from 'vue'
import type { SocketListeners, Listener } from '../types/WebSocket';

const serverPort = 4000;
const socketAddress = `ws://${import.meta.env.VITE_HOST_IP}:${serverPort}/ws`;


const isLoading = ref(false)
const socketListeners: SocketListeners = reactive({})

export default function useWebSocket(listeners: Listener[] = []) {
  listeners.forEach(listener => {
    Object.entries(listener).forEach(([key, handler]) => {
      socketListeners[key] ??= [] ;
      socketListeners[key].push(handler);
    })
  })

  let websocket: WebSocket;

  function createWebSocket() {
    isLoading.value = true
    websocket = new WebSocket(socketAddress);
    websocket.onopen = onWebSocketOpen
  }

  function startWebSocketService() {
    console.log('Begin polling for WebSocket Connection');
    createWebSocket();
    setTimeout(() => {
      // If that connection does not open up
      // within 3 seconds, begin retry loop
      if (websocket.readyState !== WebSocket.OPEN) {
        websocket.close()
        handleWebSocketRetry()
      } else {
        websocket.onclose = onWebSocketClose
      }
    }, 3000)
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
        websocket.onmessage = (event) => onWebSocketMessage(event);
        websocket.onclose = onWebSocketClose;
        return;
      }
      // Otherwise, close the existing attempt and start a new one
      console.log('Attempting to re-connect...');
      websocket.close()
      createWebSocket()
    }, 3000);
  }

  function onWebSocketOpen() {
    console.log('WebSocket connection established')
    isLoading.value = false
    websocket.onmessage = (event) => onWebSocketMessage(event);
  }
  
  function onWebSocketClose() {
    console.log('Connection closed')
    handleWebSocketRetry()
  }

  async function onWebSocketMessage(event: MessageEvent) {
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
    isLoading,
    startWebSocketService
  }
}