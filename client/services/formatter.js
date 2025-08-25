export function formatMessage(data) {
  console.log(data)
  if (typeof data === 'string') {
    if (data === 'spellInterrupt') console.log('Spell was interrupted');
    return;
  }

  const keys = Object.keys(data);
  keys.forEach(key => {
    if (key === 'location') handleLocation(data[key]);
    if (key === 'debug') handleDebug(data[key]);
    if (key === 'compassDirection') handleCompassDirection(data[key]);
    if (key === 'petName') handlePetName(data[key]);
    if (key === 'petStatus') handlePetStatus(data[key]);
    if (key === 'coinLoot') handleCoinLoot(data[key]);
    if (key === 'zone') handleZoneChange(data[key]);
  });
}

function handleDebug(debugMessage) {
  handleTextLog('debug', debugMessage);
}

function handleCoinLoot(coins) {
  Object.entries(coins.total).forEach(([type, amount]) => {
    updateElementById(`total-coin-${type}`, `Total ${type}: ${amount}`);
  });
  Object.entries(coins.received).forEach(([type, amount]) => {
    updateElementById(`coin-${type}`, `Total ${type}: ${amount}`);
  });
  setTimeout(() => {
    for (const type of ['copper', 'silver', 'gold', 'platinum']) {
      updateElementById(`coin-${type}`, `Total ${type}: 0`);
    }
  }, 4000);
}

function handleLocation(location) {
  const innerText = `X: ${location.x}, Y: ${location.y}`;
  document.getElementById('location').innerText = innerText;
}

function handleCompassDirection(direction) {
  updateElementById('compassDirection', direction);
}

function handlePetName(petName) {
  updateElementById('petName', petName);
}

function handlePetStatus(petStatus) {
  updateElementById('petStatus', petStatus);
}

function handleZoneChange(zoneName) {
  updateElementById('zone', zoneName);
}
