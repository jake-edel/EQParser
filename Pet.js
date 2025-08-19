import gameState from './GameState.js';

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
      'following_you_master': 'following',
      'at_your_service_master': 'summoned',
      'sorry_master_calming_down': 'backed off',
      'changing_position_master': 'sitting',
      'guarding_with_my_life_oh_splendid_one': 'guarding'
    };
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
    const lineId = line.split('says ')[1]?.toLowerCase()
      .replace(/\.\./g, '_')
      .replace(/[.,']/g, '')
      .replace(/ /g, '_')
      .trim();

    gameState.petStatus = this.petStates[lineId] || null;
  }

  stripTimestamp(line) {
    return line.replace(/^\[[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\]\s*/, '').trim();
  }
}

export default new Pet();
