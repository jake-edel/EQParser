   import location from "../Location.js";
   import spell from "../Spell.js";
   import pet from '../Pet.js';
   import loot from "../Loot.js";

   export default [
      { test: location.isDirection, handle: location.getCompassDirection },
      { test: location.isLocation, handle: location.getLocationData },
      { test: location.isZone, handle: location.getCurrentZone },
      { test: spell.isSpellCast, handle: spell.handleSpellCast },
      { test: pet.isPetData, handle: pet.handlePetData },
      { test: loot.isCoinReceive, handle: loot.handleCoinReceive },
    ];