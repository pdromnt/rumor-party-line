import { partyLines } from "../stores/dataStore";
import { broadcast } from "./broadcastService";

export const maintenanceService = () => {
  const now = Date.now();
  Object.keys(partyLines).forEach((currentPartyLine) => {
    const partyLine = partyLines[currentPartyLine];
    if (partyLine.lastEvent && partyLine.clients.length > 0) {
      broadcast(currentPartyLine, partyLine.lastEvent);
    }
    if (now - partyLine.lastActivity > 3600000) { // 1 hour in milliseconds
      console.log(`DELETE: Deleting inactive party line ${currentPartyLine}`);
      delete partyLines[currentPartyLine];
    }
  });
}