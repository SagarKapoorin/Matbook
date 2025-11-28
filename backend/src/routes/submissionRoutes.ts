import { Router, Request, Response, NextFunction } from 'express';
import formSchema from '../schemas/formSchema';
import { validateSubmissionData } from '../services/validationService';
import { createSubmission, getSubmissions, deleteSubmission } from '../controllers/submissionController';

const router = Router();

const validateSubmissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { isValid, errors } = validateSubmissionData(req.body || {}, formSchema);
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

router.post('/', validateSubmissionMiddleware, createSubmission);

router.get('/', getSubmissions);

router.delete('/:id', deleteSubmission);

export default router;

