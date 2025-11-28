import { Router } from 'express';
import formRoutes from './formRoutes';
import submissionRoutes from './submissionRoutes';

const router = Router();

router.use('/form-schema', formRoutes);
router.use('/submissions', submissionRoutes);

export default router;

