   import location from "../parser/modules/Location.ts";
   import spell from "../parser/modules/Spell.ts";
   import pet from '../parser/modules/Pet.ts';
   import loot from "../parser/modules/Loot.ts";
   import camping from "../parser/modules/Camping.ts";
   import chat from "../parser/modules/Chat.ts"
   import server from "../parser/Server.ts";

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
      },
      {
         condition: (line: string) => chat.isAuction(line),
         handler: (line: string) => chat.auctionHandler(line)
      },
      {
         condition: () => true,
         handler: (line: string) => server.send(line, 'log')
      }
    ];