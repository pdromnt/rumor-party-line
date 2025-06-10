import { Router } from 'express';
import path from 'path';

const router = Router();

// Navigate to the admin route in the client
router.get('/admin', (_req: any, res: any) => {
  res.sendFile(path.resolve(__dirname, '../../static', 'index.html'));
});

export default router;