   import location from "../Location";
   import spell from "../Spell";
   import pet from '../Pet';
   import loot from "../Loot";

   export default [
      { test: location.isDirection, handle: location.getCompassDirection },
      { test: location.isLocation, handle: location.getLocationData },
      { test: location.isZone, handle: location.getCurrentZone },
      { test: spell.isSpellCast, handle: spell.handleSpellCast },
      { test: pet.isPetData, handle: pet.handlePetData },
      { test: loot.isCoinReceive, handle: loot.handleCoinReceive },
    ];