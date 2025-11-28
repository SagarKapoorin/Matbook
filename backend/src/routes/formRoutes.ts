import { Router, Request, Response } from 'express';
import formSchema from '../schemas/formSchema';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    schema: formSchema,
  });
});

export default router;

