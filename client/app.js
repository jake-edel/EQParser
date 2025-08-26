import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import useWebSocket from './composables/useWebSocket.js'

const LogLine = {
  template: `<p>{{ message }}</p>`,
  props: ['message']
}

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

    const handleLogMessage = (message) => {
      logIsReversed.value
        ? log.value.unshift(message)
        : log.value.push(message);
    }

    const socketListeners = [
      { key: 'log', handler: handleLogMessage },
      { key: 'compassDirection', handler: (message) => { compassDirection.value = message; } }
    ];

    const { startWebSocketService } = useWebSocket(socketListeners);
    
    startWebSocketService();

    const reverseLog = () => {
      log.value = log.value.slice().reverse();
      logIsReversed.value = !logIsReversed.value;
    }

    const clearLog = () => {
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
      clearLog,
    };
  },
  template: `
    <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
      <div class="card">
        <h2>Location</h2>
        <div>
          Zone: <span id="zone">{{ zone }}</span>
        </div>
        <div>
          <span id="location">{{ location }}</span>
        </div>
        <div>
          Direction: <span id="compassDirection">{{ compassDirection }}</span>
        </div>
      </div>
      <div class="card">
        <h2>Pet</h2>
        <div>
          Name: <span id="petName"></span>
        </div>
        <div>
          Status: <span id="petStatus"></span>
        </div>
      </div>
      <div class="card">
        <h2>Coins</h2>
        <div>
          <div id="coin-platinum">Platinum: 0</div>
          <div id="coin-gold">Gold: 0</div>
          <div id="coin-silver">Silver: 0</div>
          <div id="coin-copper">Copper: 0</div>
          <div id="total-coin-platinum">platinum: 0</div>
          <div id="total-coin-gold">gold: 0</div>
          <div id="total-coin-silver">silver: 0</div>
          <div id="total-coin-copper">copper: 0</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom: 16px;">
      <h2>Debug</h2>
      <div id="debug" class="chat-container"></div>
    </div>
    <div class="card" style="margin-bottom: 16px;">
      <div style="display: flex; gap: 8px;">
        <h2>Log</h2>
        <button @click="reverseLog">Reverse</button>
        <button @click="clearLog">Clear</button>
      </div>
      <div id="log" class="chat-container">
        <LogLine
          v-for="(message, index) in log"
          style="margin: 0;"
          :key="message + index"
          :message
        />
      </div>
    </div>
  `,
  components: {
    LogLine: LogLine,
  },
}).mount("#app");