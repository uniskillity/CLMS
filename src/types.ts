/**
 * Campus Library Management System TS Types
 */

export interface Book {
  bookId: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  status: 'Available' | 'Out of Stock';
  cover: string;
}

export interface Member {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Suspended';
}

export type FineStatusGroup = 'N/A' | 'Unpaid' | 'Paid';

export interface Transaction {
  transactionId: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  overdueDays: number;
  fineAmount: number;
  fineStatus: FineStatusGroup;
}

export interface UserProfile {
  username: string;
  name: string;
  role: 'Admin' | 'Librarian' | 'Student';
  email: string;
  phone: string;
  lastLogin: string;
}
