import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import useWebSocket from './composables/useWebSocket.js'

createApp({
  setup() {
    const location = ref({ x: 0, y: 0 });
    const compassDirection = ref('');
    const petName = ref('');
    const petStatus = ref('');
    const zone = ref('');
    const debugMessages = ref([]);
    const log = ref([]);
    const coinLoot = ref({ total: {}, received: {} });
    const logIsReversed = ref(false);

    const socketListeners = [
      { key: 'log', handler: handleLogMessage },
      { key: 'compassDirection', handler: (message) => { compassDirection.value = message; } }
    ];

    const { startWebSocketService } = useWebSocket(socketListeners);

    startWebSocketService();
    
    function handleLogMessage(message) {
      logIsReversed.value
        ? log.value.unshift(message)
        : log.value.push(message);
    }

    function reverseLog() {
      log.value = log.value.slice().reverse();
      logIsReversed.value = !logIsReversed.value;
    }

    function clearLog() {
      log.value.length = 0;
    }

    return {
      location,
      compassDirection,
      petName,
      petStatus,
      zone,
      debugMessages,
      log,
      coinLoot,
      reverseLog,
      clearLog
    };
  }
}).mount('#app');