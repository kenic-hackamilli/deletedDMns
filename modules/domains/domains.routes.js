import { Router } from 'express';
import { listDomains, importDomains, markReacquired } from './domains.controller.js';

const router = Router();

router.get('/', listDomains);
router.post('/import', importDomains);
router.patch('/:id/reacquire', markReacquired);

export default router;
