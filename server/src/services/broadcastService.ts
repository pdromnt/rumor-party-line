import { partyLines } from '../stores/dataStore';

// Function to broadcast a rumor to all clients at a party line
export const broadcast = (currentPartyLine: string, rumor: string) => {
  const partyLine = partyLines[currentPartyLine];
  if (partyLine) {
    console.log(`BROADCAST: { partyLine: ${currentPartyLine}, rumor: ${rumor} }`);
    partyLine.clients.forEach((client: any) => {
      if (client.response && typeof client.response.write === 'function') {
        try {
          client.response.write(`data: ${rumor}\n\n`);
        } catch (err) {
          console.error(`ERROR: Failed to write to client ${client.clientId}`, err);
        }
      } else {
        console.error(`ERROR: Response object is invalid for client ${client.clientId}`);
      }
    });
  }
};