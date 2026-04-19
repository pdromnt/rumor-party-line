import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MAX_PARTY_LINES, INITIAL_RUMOR } from '../stores/configStore';
import { partyLines } from '../stores/dataStore';
import { broadcast } from '../services/broadcastService';

const router = Router();

// Route to get all party lines
router.get('/partyLines', (_req: Request, res: Response) => {
  const allPartyLines = Object.keys(partyLines).map(key => ({
    name: key,
    ...partyLines[key],
    clients: partyLines[key].clients.map(({ response, ...client }) => client)
  }));
  res.status(200).send(allPartyLines);
});

// Route to create a new party line
router.post('/createPartyLine', [
  body('partyLine').isString().trim().escape().notEmpty().withMessage('Invalid party line name')
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { partyLine: currentPartyLine } = req.body;
    if (Object.keys(partyLines).length >= MAX_PARTY_LINES) {
      res.status(400).send({ status: 'Maximum number of party lines reached' });
      return;
    }
    if (partyLines[currentPartyLine]) {
      res.status(400).send({ status: 'Party line already exists' });
      return;
    }

    // Create a new party line
    partyLines[currentPartyLine] = {
      clients: [],
      lastEvent: INITIAL_RUMOR,
      lastActivity: Date.now()
    };

    console.log(`CREATE: { partyLine: ${currentPartyLine} }`);
    res.status(200).send({ status: 'Party line created', currentPartyLine });
  } catch (error) {
    console.error('ERROR: Failed to create party line', error);
    res.status(500).send({ status: 'Internal server error' });
  }
});

// Route to delete a party line
router.delete('/deletePartyLine', [
  body('partyLine').isString().trim().escape().notEmpty().withMessage('Invalid party line name')
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { partyLine: currentPartyLine } = req.body;
    const partyLine = partyLines[currentPartyLine];
    if (!partyLine) {
      res.status(404).send({ status: 'Party line not found' });
      return;
    }

    // Broadcast deletion message to all clients
    broadcast(currentPartyLine, 'PARTY_LINE_DELETED');

    // Disconnect all clients
    partyLine.clients.forEach((client) => {
      console.log(`DISCONNECTING: { partyLine: ${currentPartyLine}, clientId: ${client.clientId} }`);
      client.response.end();
    });

    // Delete the party line
    delete partyLines[currentPartyLine];
    console.log(`DELETE: { partyLine: ${currentPartyLine} }`);
    res.status(200).send({ status: 'Party line deleted', currentPartyLine });
  } catch (error) {
    console.error('ERROR: Failed to delete party line', error);
    res.status(500).send({ status: 'Internal server error' });
  }
});

// Route to send an event to a party line
router.post('/rumor', [
  body('partyLine').isString().trim().escape().notEmpty().withMessage('Invalid party line name'),
  body('rumor').isString().trim().escape().notEmpty().withMessage('Invalid rumor')
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { partyLine: connectedPartyLine, rumor } = req.body;
    const partyLine = partyLines[connectedPartyLine];
    if (!partyLine) {
      res.status(404).send({ status: 'Party line not found' });
      return;
    }

    console.log(`RECEIVE: { partyLine: ${connectedPartyLine}, rumor: ${rumor} }`);

    // Update the last event and broadcast it to all clients
    partyLine.lastEvent = rumor;
    partyLine.clients.forEach((client) => {
      client.response.write(`data: ${rumor}\n\n`);
    });
    res.status(200).send({ status: 'Rumor broadcast' });
  } catch (error) {
    console.error('ERROR: Failed to send event', error);
    res.status(500).send({ status: 'Internal server error' });
  }
});

export default router;