/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Member, Transaction, UserProfile } from './types';
import { 
  INITIAL_BOOKS, 
  INITIAL_MEMBERS, 
  INITIAL_TRANSACTIONS, 
  loadData, 
  saveData 
} from './data';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import BookCatalogScreen from './components/BookCatalogScreen';
import IssueBookScreen from './components/IssueBookScreen';
import ReturnBookScreen from './components/ReturnBookScreen';
import MemberManagementScreen from './components/MemberManagementScreen';
import FineManagementScreen from './components/FineManagementScreen';
import ReportsScreen from './components/ReportsScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  // Authentication state
  const [user, setUser] = useState<UserProfile | null>(() => loadData<UserProfile | null>('clms_user', null));
  
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core Data sets
  const [books, setBooks] = useState<Book[]>(() => loadData<Book[]>('clms_books', INITIAL_BOOKS));
  const [members, setMembers] = useState<Member[]>(() => loadData<Member[]>('clms_members', INITIAL_MEMBERS));
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Calculate dynamic outstanding late metrics dynamically
  useEffect(() => {
    const rawTransactions = loadData<Transaction[]>('clms_transactions', INITIAL_TRANSACTIONS);
    
    // Recalculate late status based on current local date
    const today = new Date();
    today.setHours(0,0,0,0);

    const calculated = rawTransactions.map((t) => {
      if (t.returnDate !== null) return t; // Sealed Transaction

      const due = new Date(t.dueDate);
      if (due < today) {
        const diffTime = Math.abs(today.getTime() - due.getTime());
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...t,
          overdueDays,
          fineAmount: overdueDays * 10,
          fineStatus: 'Unpaid' as const,
        };
      }
      return t;
    });

    setTransactions(calculated);
    saveData('clms_transactions', calculated);
  }, []);

  // Save states to localstorage on edits
  const handleSetUser = (prof: UserProfile | null) => {
    setUser(prof);
    saveData('clms_user', prof);
    if (prof) {
      setCurrentTab('dashboard'); // reset navigation on successful login
    }
  };

  const handleLogout = () => {
    handleSetUser(null);
  };

  // 1. Book catalogs operations
  const handleAddBook = (newBook: Book) => {
    const nextArr = [newBook, ...books];
    setBooks(nextArr);
    saveData('clms_books', nextArr);
  };

  const handleEditBook = (updatedBook: Book) => {
    const nextArr = books.map((b) => b.bookId === updatedBook.bookId ? updatedBook : b);
    setBooks(nextArr);
    saveData('clms_books', nextArr);
  };

  const handleDeleteBook = (bookId: string) => {
    const nextArr = books.filter((b) => b.bookId !== bookId);
    setBooks(nextArr);
    saveData('clms_books', nextArr);
  };

  // 2. Members roster operations
  const handleAddMember = (newMem: Member) => {
    const nextArr = [newMem, ...members];
    setMembers(nextArr);
    saveData('clms_members', nextArr);
  };

  const handleEditMember = (updatedMem: Member) => {
    const nextArr = members.map((m) => m.memberId === updatedMem.memberId ? updatedMem : m);
    setMembers(nextArr);
    saveData('clms_members', nextArr);
  };

  const handleDeleteMember = (memberId: string) => {
    const nextArr = members.filter((m) => m.memberId !== memberId);
    setMembers(nextArr);
    saveData('clms_members', nextArr);
  };

  // 3. Transactions / Loans actions
  const handleIssueBook = (bookId: string, memberId: string, issueDate: string, dueDate: string) => {
    // Locate targets
    const book = books.find(b => b.bookId === bookId)!;
    const member = members.find(m => m.memberId === memberId)!;

    // Deduct available copies
    const nextBooks = books.map(b => b.bookId === bookId ? {
      ...b,
      availableCopies: b.availableCopies - 1,
      status: (b.availableCopies - 1) > 0 ? 'Available' as const : 'Out of Stock' as const
    } : b);

    setBooks(nextBooks);
    saveData('clms_books', nextBooks);

    // Register active transaction
    const nextTran: Transaction = {
      transactionId: `T00${transactions.length + 1}`,
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: member.name,
      issueDate,
      dueDate,
      returnDate: null,
      overdueDays: 0,
      fineAmount: 0,
      fineStatus: 'N/A'
    };

    const nextTrans = [nextTran, ...transactions];
    setTransactions(nextTrans);
    saveData('clms_transactions', nextTrans);
  };

  const handleReturnBook = (transactionId: string, actualReturnDate: string) => {
    const tran = transactions.find(t => t.transactionId === transactionId)!;

    // Increment books copy back
    const nextBooks = books.map(b => b.bookId === tran.bookId ? {
      ...b,
      availableCopies: b.availableCopies + 1,
      status: 'Available' as const
    } : b);
    setBooks(nextBooks);
    saveData('clms_books', nextBooks);

    // Seal Transaction
    const today = new Date(actualReturnDate);
    const due = new Date(tran.dueDate);
    let overdueDays = 0;
    let fineAmount = 0;
    let fineStatus: Transaction['fineStatus'] = 'N/A';

    if (due < today) {
      const diffTime = Math.abs(today.getTime() - due.getTime());
      overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 10;
      fineStatus = 'Unpaid';
    }

    const nextTrans = transactions.map(t => t.transactionId === transactionId ? {
      ...t,
      returnDate: actualReturnDate,
      overdueDays,
      fineAmount,
      fineStatus
    } : t);

    setTransactions(nextTrans);
    saveData('clms_transactions', nextTrans);
  };

  const handleCollectFine = (transactionId: string) => {
    const nextTrans = transactions.map(t => t.transactionId === transactionId ? {
      ...t,
      fineStatus: 'Paid' as const
    } : t);
    setTransactions(nextTrans);
    saveData('clms_transactions', nextTrans);
  };

  // If user is unauthenticated, redirect to login page
  if (!user) {
    return <LoginScreen onLoginSuccess={handleSetUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Collapsible sticky Left Sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main viewport Container */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Render active display */}
        {currentTab === 'dashboard' && (
          <DashboardScreen 
            books={books}
            members={members}
            transactions={transactions}
            user={user}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'books' && (
          <BookCatalogScreen 
            books={books}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
            user={user}
          />
        )}

        {currentTab === 'issue' && (
          <IssueBookScreen 
            books={books}
            members={members}
            transactions={transactions}
            onIssueBook={handleIssueBook}
          />
        )}

        {currentTab === 'return' && (
          <ReturnBookScreen 
            books={books}
            transactions={transactions}
            onReturnBook={handleReturnBook}
          />
        )}

        {currentTab === 'members' && (
          <MemberManagementScreen 
            members={members}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            user={user}
          />
        )}

        {currentTab === 'fines' && (
          <FineManagementScreen 
            transactions={transactions}
            onCollectFine={handleCollectFine}
            user={user}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsScreen 
            books={books}
            members={members}
            transactions={transactions}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen 
            user={user}
          />
        )}
      </main>
    </div>
  );
}
