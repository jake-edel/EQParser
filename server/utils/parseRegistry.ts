   import location from "../parser/Location.ts";
   import spell from "../parser/Spell.ts";
   import pet from '../parser/Pet.ts';
   import loot from "../parser/Loot.ts";
   import camping from "../parser/Camping.ts";

   // Passing the methods as callback causes the method
   // to lose the context of 'this'. Passing an arrow function
   // preserves the context
   export default [
      {
         condition: (line: string) => location.isDirection(line),
         handler: (line: string) => location.getCompassDirection(line)
      },
      {
         condition: (line: string) => location.isLocation(line),
         handler: (line: string) => location.getLocationData(line)
      },
      {
         condition: (line: string) => location.isZone(line),
         handler: (line: string) => location.getCurrentZone(line)
      },
      {
         condition: (line: string) => spell.isSpellCast(line),
         handler: (line: string) => spell.handleSpellCast(line)
      },
      {
         condition: (line: string) => pet.isPetData(line),
         handler: (line: string) => pet.handlePetData(line)
      },
      {
         condition: (line: string) => loot.isCoinReceive(line),
         handler: (line: string) => loot.handleCoinReceive(line)
      },
      {
         condition: (line: string) => camping.isCampingMessage(line),
         handler: (line: string) => camping.handleMakeCamp(line)
      }
    ];