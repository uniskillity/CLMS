import { Book, Member, Transaction } from './types';

// Helper to format dates relative to today
export const getRelativeDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const INITIAL_BOOKS: Book[] = [
  {
    bookId: 'B001',
    title: 'Data Structures and Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 10,
    status: 'Available',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
  },
  {
    bookId: 'B002',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Computer Science',
    totalCopies: 8,
    availableCopies: 5,
    status: 'Available',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
  },
  {
    bookId: 'B003',
    title: 'Database System Concepts',
    author: 'Avi Silberschatz',
    category: 'Information Tech',
    totalCopies: 10,
    availableCopies: 8,
    status: 'Available',
    cover: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=150&auto=format&fit=crop&q=80',
  },
  {
    bookId: 'B004',
    title: 'Computer Networks: A Top-Down Approach',
    author: 'James Kurose',
    category: 'Networking',
    totalCopies: 6,
    availableCopies: 0,
    status: 'Out of Stock',
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
  },
  {
    bookId: 'B005',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    category: 'Artificial Intelligence',
    totalCopies: 15,
    availableCopies: 12,
    status: 'Available',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80',
  },
  {
    bookId: 'B006',
    title: 'Software Engineering Practice',
    author: 'Ian Sommerville',
    category: 'Software Engineering',
    totalCopies: 7,
    availableCopies: 6,
    status: 'Available',
    cover: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    memberId: 'M001',
    name: 'Emily Watson',
    email: 'emily.watson@university.edu',
    phone: '555-0192',
    joinDate: '2025-09-10',
    status: 'Active',
  },
  {
    memberId: 'M002',
    name: 'Alexander Martinez',
    email: 'a.martinez@university.edu',
    phone: '555-0143',
    joinDate: '2025-10-15',
    status: 'Active',
  },
  {
    memberId: 'M003',
    name: 'Sarah Jenkins',
    email: 'sjenkins23@university.edu',
    phone: '555-0187',
    joinDate: '2025-11-01',
    status: 'Active',
  },
  {
    memberId: 'M004',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    phone: '555-0121',
    joinDate: '2026-01-20',
    status: 'Active',
  },
  {
    memberId: 'M005',
    name: 'Chloe Fontaine',
    email: 'cfontaine@university.edu',
    phone: '555-0165',
    joinDate: '2026-03-05',
    status: 'Suspended',
  }
];

// Initial Transactions (some active, some return, some overdue)
// Active means returnDate = null
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'T001',
    bookId: 'B001',
    bookTitle: 'Data Structures and Algorithms',
    memberId: 'M001',
    memberName: 'Emily Watson',
    issueDate: getRelativeDateString(-15),
    dueDate: getRelativeDateString(-1), // overdue by 1 day
    returnDate: null,
    overdueDays: 1,
    fineAmount: 10, // 10 * 1 day
    fineStatus: 'Unpaid',
  },
  {
    transactionId: 'T002',
    bookId: 'B002',
    bookTitle: 'Operating System Concepts',
    memberId: 'M002',
    memberName: 'Alexander Martinez',
    issueDate: getRelativeDateString(-10),
    dueDate: getRelativeDateString(4), // not overdue yet
    returnDate: null,
    overdueDays: 0,
    fineAmount: 0,
    fineStatus: 'N/A',
  },
  {
    transactionId: 'T003',
    bookId: 'B004',
    bookTitle: 'Computer Networks: A Top-Down Approach',
    memberId: 'M003',
    memberName: 'Sarah Jenkins',
    issueDate: getRelativeDateString(-25),
    dueDate: getRelativeDateString(-11), // overdue by 11 days
    returnDate: null,
    overdueDays: 11,
    fineAmount: 110,
    fineStatus: 'Unpaid',
  },
  {
    transactionId: 'T004',
    bookId: 'B003',
    bookTitle: 'Database System Concepts',
    memberId: 'M004',
    memberName: 'David Kim',
    issueDate: getRelativeDateString(-20),
    dueDate: getRelativeDateString(-6),
    returnDate: getRelativeDateString(-5), // Was returned 5 days ago, overdue by 1 day
    overdueDays: 1,
    fineAmount: 10,
    fineStatus: 'Paid',
  },
  {
    transactionId: 'T005',
    bookId: 'B005',
    bookTitle: 'Artificial Intelligence: A Modern Approach',
    memberId: 'M001',
    memberName: 'Emily Watson',
    issueDate: getRelativeDateString(-5),
    dueDate: getRelativeDateString(9),
    returnDate: null,
    overdueDays: 0,
    fineAmount: 0,
    fineStatus: 'N/A',
  }
];

// LocalStorage helpers
export const loadData = <T>(key: string, initialData: T): T => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return initialData;
    }
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

export const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
