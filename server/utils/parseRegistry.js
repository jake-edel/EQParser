   import location from "../parser/Location.js";
   import spell from "../parser/Spell.js";
   import pet from '../parser/Pet.js';
   import loot from "../parser/Loot.js";
   import camping from "../parser/Camping.ts";

   // Passing the methods as callback causes the method
   // to lose the context of 'this'. Passing an arrow function
   // preserves the context
   export default [
      {
         condition: (line) => location.isDirection(line),
         handler: (line) => location.getCompassDirection(line)
      },
      {
         condition: (line) => location.isLocation(line),
         handler: (line) => location.getLocationData(line)
      },
      {
         condition: (line) => location.isZone(line),
         handler: (line) => location.getCurrentZone(line)
      },
      {
         condition: (line) => spell.isSpellCast(line),
         handler: (line) => spell.handleSpellCast(line)
      },
      {
         condition: (line) => pet.isPetData(line),
         handler: (line) => pet.handlePetData(line)
      },
      {
         condition: (line) => loot.isCoinReceive(line),
         handler: (line) => loot.handleCoinReceive(line)
      },
      {
         condition: (line) => camping.isCampingMessage(line),
         handler: (line) => camping.handleMakeCamp(line)
      }
    ];