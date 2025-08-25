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

    const handleWebSocketMessage = async (event) => {
      if (typeof event.data === 'string') {
        console.log("Received message:", event.data);
        return;
      }

      const data = JSON.parse(await event.data.text());
      Object.keys(data).forEach((key) => {
        const message = data[key]
        if (key === 'log') handleLogMessage(message)
      });
    }

    const { startWebSocketService } = useWebSocket({ handleWebSocketMessage });

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