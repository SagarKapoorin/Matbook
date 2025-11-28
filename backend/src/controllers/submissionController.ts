import { Request, Response, NextFunction } from 'express';
import {
  createSubmissionRecord,
  deleteSubmissionById,
  listSubmissions,
  ListSubmissionsParams,
} from '../services/submissionService';

export const createSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body as Record<string, any>;
    const { id, createdAt } = createSubmissionRecord(data);
    res.status(201).json({
      success: true,
      id,
      createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (
  req: Request<{}, any, any, ListSubmissionsParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = listSubmissions(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = deleteSubmissionById(id);
    if (!deleted) {
      res.status(404).json({ id: 'Submission not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

