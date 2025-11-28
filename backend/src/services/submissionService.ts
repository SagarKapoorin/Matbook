import { randomUUID } from 'crypto';
import { Submission } from '../types';

const submissions: Submission[] = [];

export interface ListSubmissionsParams {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListSubmissionsResult {
  data: Submission[];
  total: number;
  page: number;
  totalPages: number;
}

export const createSubmissionRecord = (
  data: Record<string, any>,
): { id: string; createdAt: string } => {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const submission: Submission = {
    id,
    createdAt,
    data,
  };
  submissions.push(submission);
  return { id, createdAt };
};

export const listSubmissions = (params: ListSubmissionsParams): ListSubmissionsResult => {
  const {
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
  const order: 'asc' | 'desc' = sortOrder === 'asc' ? 'asc' : 'desc';
  const sortableField = sortBy === 'createdAt' ? 'createdAt' : 'createdAt';
  const sorted = [...submissions].sort((a, b) => {
    const aVal = a[sortableField];
    const bVal = b[sortableField];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  const total = sorted.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / limitNumber);
  const startIndex = (pageNumber - 1) * limitNumber;
  const paginatedData = sorted.slice(startIndex, startIndex + limitNumber);
  return {
    data: paginatedData,
    total,
    page: pageNumber,
    totalPages,
  };
};

export const deleteSubmissionById = (id: string): boolean => {
  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) {
    return false;
  }
  submissions.splice(index, 1);
  return true;
};

export const getInMemorySubmissionsStore = (): Submission[] => submissions;

