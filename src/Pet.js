import gameState from './GameState.js';
import Debugger from './Debugger.js'

class Pet {
  constructor() {
    this.petSignatures = [
      'At your service master.',
      'Sorry, Master..calming down.',
      'Following you, Master.',
      'Changing position, Master.',
      'Guarding with my life..oh splendid one.',
      'tells you, \'Attacking'
    ];
    this.petStates = {
      'following_you_master': 'Following',
      'at_your_service_master': 'Summoned',
      'sorry_master_calming_down': 'Backed off',
      'changing_position_master': 'Sitting',
      'guarding_with_my_life_oh_splendid_one': 'Guarding',
    };
    this.debug = new Debugger(this.constructor.name);

    this.debug.enable()
  }

  isPetData(line) {
    return this.petSignatures.some(signature => line.includes(signature));
  }

  handlePetData(line) {
    this.getPetName(line);
    this.getPetStatus(line);
  }

  getPetName(line) {
    const [ , , , , , petName] = line.split(' ');
    gameState.currentPet = petName;
  }

  getPetStatus(line) {
    this.debug.log('Raw pet line:', line);
    if (line.includes('tells you, \'Attacking')) {
      this.handlePetAttack(line);
      return;
    }
    const lineId = line.split('says ')[1]?.toLowerCase()
      .replace(/\.\./g, '_')
      .replace(/[.,']/g, '')
      .replace(/ /g, '_')
      .trim();

    // this.debug.log('Pet status ID:', lineId);

    const petStatus = this.petStates[lineId] || null;

    gameState.petStatus = petStatus;
  }

  handlePetAttack(line) {
    this.debug.log('Pet is attacking:', line);
    const attackStatus = line.split('tells you, ')[1]
      .replace(/\.\./g, '_')
      .replace(/[.,']/g, '')
      .replace(' Master', '')
      .trim();

    this.debug.log('Pet attack status:', attackStatus);

    gameState.petStatus = attackStatus;
  }

  stripTimestamp(line) {
    return line.replace(/^\[[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\]\s*/, '').trim();
  }
}

export default new Pet();
