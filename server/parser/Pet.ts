import gameState from './GameState.ts';
import Debugger from './Debugger.ts'
import server from './Server.ts';

class Pet {
  debug: Debugger = new Debugger(this.constructor.name).enable()
  petSignatures: Array<string> = [
      'At your service master.',
      'Sorry, Master..calming down.',
      'Following you, Master.',
      'Changing position, Master.',
      'Guarding with my life..oh splendid one.',
      'tells you, \'Attacking'
    ];
  petStates = {
    'following_you_master': 'Following',
    'at_your_service_master': 'Summoned',
    'sorry_master_calming_down': 'Backed off',
    'changing_position_master': 'Sitting',
    'guarding_with_my_life_oh_splendid_one': 'Guarding',
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
    server.send(petName, 'petName');
  }

  getPetStatus(line) {
    this.debug.log('Raw pet line:', line);
    let petStatus = null;
    if (line.includes('tells you, \'Attacking')) {
      petStatus = this.handlePetAttack(line);
      server.send(petStatus, 'petStatus');
      return;
    }
    const lineId = line.split('says ')[1]?.toLowerCase()
      .replace(/\.\./g, '_')
      .replace(/[.,']/g, '')
      .replace(/ /g, '_')
      .trim();

    petStatus = this.petStates[lineId] || null;

    gameState.petStatus = petStatus;
    server.send(petStatus, 'petStatus');
  }

  handlePetAttack(line) {
    this.debug.log('Pet is attacking:', line);
    const attackStatus = line.split('tells you, ')[1]
      .replace(/\.\./g, '_')
      .replace(/[.,']/g, '')
      .replace(' Master', '')
      .trim();

    this.debug.log('Pet attack status:', attackStatus);

    return attackStatus
  }
}

export default new Pet();
