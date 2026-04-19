import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

// Navigate to the admin route in the client
router.get('/admin', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../static', 'index.html'));
});

export default router;