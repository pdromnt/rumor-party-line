import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { partyLines } from '../stores/dataStore';
import { v4 as uuidv4 } from 'uuid';
import { Client } from "../types/partyLine";

const router = Router();

// Route to verify if a party line exists before connecting
router.get('/joinPartyLine', [
  query('partyLine').isString().trim().escape().notEmpty().withMessage('Invalid party line name')
], (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const currentPartyLine = req.query.partyLine;
    const partyLine = partyLines[currentPartyLine];
    if (!partyLine) {
      return res.status(404).send({ status: 'Party line not found' });
    }
    res.status(200).send({ status: 'Connection to party line authorized' });
  } catch (error) {
    console.error('ERROR: Failed to join party line', error);
    res.status(500).send({ status: 'Internal server error' });
  }
});

// Route to connect to party line and receive rumors
router.get('/connectPartyLine', [
  query('partyLine').isString().trim().escape().notEmpty().withMessage('Invalid party line name')
], (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const connectedPartyLine = req.query.partyLine;
    const partyLine = partyLines[connectedPartyLine];
    if (!partyLine) {
      return res.status(404).send({ status: 'Party line not found' });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = `${uuidv4()}`;
    const client: Client = { clientId, response: res, ipAddress: res.socket.remoteAddress };

    // Add client to the party line
    partyLine.clients.push(client);
    partyLine.lastActivity = Date.now();

    console.log(`JOIN: { partyLine: ${connectedPartyLine}, clientId: ${clientId} }`);

    // Send the last event to the client
    res.write(`data: ${partyLine.lastEvent}\n\n`);

    // Keep-alive mechanism to keep the connection open
    const keepAliveId = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 15000);

    // Function to remove the client from the party line
    const removeClient = () => {
      clearInterval(keepAliveId);
      const index = partyLine.clients.findIndex((client: any) => client.clientId === clientId);
      if (index !== -1) {
        partyLine.clients.splice(index, 1);
        console.log(`REMOVE: { partyLine: ${connectedPartyLine}, clientId: ${clientId} }`);
      } else {
        console.log(`CLIENT_NOT_FOUND: { partyLine: ${connectedPartyLine}, clientId: ${clientId} }`);
      }
      try {
        res.write('event: close\ndata: finished\n\n');
        res.end();
      } catch (err) {
        console.error(`ERROR: Error sending close event for client ${clientId}:`, err);
      }
      console.log(`DISCONNECT: { partyLine: ${connectedPartyLine}, clientId: ${clientId} }`);
    };

    // Handle client disconnection
    req.on('close', removeClient);
    req.on('error', (err: any) => {
      console.error(`ERROR: Error in client connection in party line ${connectedPartyLine}:`, err);
      removeClient();
    });
  } catch (error) {
    console.error('ERROR: Failed to connect to party line', error);
    res.status(500).send({ status: 'Internal server error' });
  }
});

export default router;