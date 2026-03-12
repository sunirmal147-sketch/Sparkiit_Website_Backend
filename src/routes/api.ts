import { Router, Request, Response } from 'express';

const router = Router();

// Test API Route
router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'API is healthy' });
});

export default router;
