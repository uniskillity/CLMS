import React, { useState } from 'react';
import { Book, UserProfile } from '../types';
import { Search, Plus, Edit, Trash2, X, Filter, BookOpen, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookCatalogScreenProps {
  books: Book[];
  onAddBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  user: UserProfile;
}

export default function BookCatalogScreen({ 
  books, 
  onAddBook, 
  onEditBook, 
  onDeleteBook, 
  user 
}: BookCatalogScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(user.role === 'Student' ? 'grid' : 'table');
  
  // Modal/Panel states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [totalCopies, setTotalCopies] = useState<number>(5);
  const [availableCopies, setAvailableCopies] = useState<number>(5);
  const [coverUrl, setCoverUrl] = useState('');

  // Extract unique categories for filter dropdown
  const categories = Array.from(new Set(books.map((b) => b.category)));

  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setCategory('Computer Science');
    setTotalCopies(5);
    setAvailableCopies(5);
    setCoverUrl('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setTotalCopies(book.totalCopies);
    setAvailableCopies(book.availableCopies);
    setCoverUrl(book.cover);
    setIsFormOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    // Use placeholder covers if empty to ensure stunning visual aesthetics
    const finalCover = coverUrl.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&auto=format&fit=crop&q=80';

    if (editingBook) {
      // Edit existing
      const updated: Book = {
        ...editingBook,
        title,
        author,
        category,
        totalCopies: Number(totalCopies),
        availableCopies: Number(availableCopies),
        status: Number(availableCopies) > 0 ? 'Available' : 'Out of Stock',
        cover: finalCover
      };
      onEditBook(updated);
    } else {
      // Add new
      const newBookId = `B00${books.length + 1}`;
      const newBook: Book = {
        bookId: newBookId,
        title,
        author,
        category,
        totalCopies: Number(totalCopies),
        availableCopies: Number(totalCopies), // initially fully available
        status: 'Available',
        cover: finalCover
      };
      onAddBook(newBook);
    }
    setIsFormOpen(false);
  };

  // Filter and search computation
  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.bookId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const canManage = ['Admin', 'Librarian'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Search and Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
              placeholder="Search by Book ID, Title, or Author..."
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative w-full sm:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-950 shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-950 shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {canManage && (
            <button
              onClick={handleOpenAdd}
              className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New Book</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-105 p-12 text-center text-slate-400">
              No books match your query. Try broadening your terms.
            </div>
          ) : (
            filteredBooks.map((book) => (
              <motion.div
                key={book.bookId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow duration-200"
              >
                {/* Book Header Image & Tag Overlay */}
                <div 
                  onClick={() => setSelectedBook(book)}
                  className="relative aspect-[3/4] bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden cursor-pointer hover:bg-slate-100/50 transition-colors group/cover"
                >
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full object-cover rounded-md shadow-md group-hover/cover:scale-[1.03] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-slate-200" />
                  )}
                  {/* Status Overlay Tag */}
                  <div className="absolute top-3 right-3">
                    {book.availableCopies > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white shadow-sm">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500 text-white shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {/* ID Overlay Tag */}
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white font-mono text-[9px] px-2 py-0.5 rounded-md font-semibold font-mono">
                    {book.bookId}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div 
                    onClick={() => setSelectedBook(book)}
                    className="space-y-1.5 cursor-pointer group/title"
                  >
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600">
                      {book.category}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover/title:text-blue-900 transition-colors" title={book.title}>
                      {book.title}
                    </h4>
                    <p className="text-slate-400 text-[11px] font-medium">{book.author}</p>
                  </div>

                  {/* Stock Details & Action buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-950 font-bold">{book.availableCopies}</span>
                      <span className="text-slate-400"> / {book.totalCopies} copies avail</span>
                    </div>

                    {canManage && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(book)}
                          className="p-1 px-2 text-slate-500 hover:text-blue-900 hover:bg-slate-55 rounded transition-colors cursor-pointer text-xs flex items-center space-x-1 border border-slate-105"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you absolutely sure you want to delete ${book.title}?`)) {
                              onDeleteBook(book.bookId);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded transition-colors cursor-pointer border border-transparent"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        /* Book Catalog Table */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Cover</th>
                  <th className="px-6 py-4">Book ID</th>
                  <th className="px-6 py-4">Title & Author</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Copies (Avail / Total)</th>
                  <th className="px-6 py-4">Status</th>
                  {canManage && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                      No books match your query. Try broadening your terms.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.bookId} className="hover:bg-slate-50/30 transition-colors">
                      {/* Cover block */}
                      <td className="px-6 py-3">
                        <div 
                          onClick={() => setSelectedBook(book)}
                          className="w-9 h-12 bg-slate-100 rounded overflow-hidden shadow-xs border border-slate-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {book.cover ? (
                            <img 
                              src={book.cover} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <BookOpen className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                      </td>
                      {/* ID */}
                      <td className="px-6 py-3 font-mono text-slate-500 font-semibold text-[11px] font-mono">{book.bookId}</td>
                      {/* Title & Author */}
                      <td className="px-6 py-3">
                        <div 
                          onClick={() => setSelectedBook(book)}
                          className="font-semibold text-slate-800 text-sm max-w-sm leading-snug line-clamp-2 cursor-pointer hover:text-blue-900 transition-colors"
                        >
                          {book.title}
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5 font-medium">{book.author}</div>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {book.category}
                        </span>
                      </td>
                      {/* Copies */}
                      <td className="px-6 py-3 text-slate-700 font-medium">
                        <span className="text-slate-950 font-semibold">{book.availableCopies}</span>
                        <span className="text-slate-400 font-normal"> / {book.totalCopies}</span>
                      </td>
                      {/* Status badge */}
                      <td className="px-6 py-3">
                        {book.availableCopies > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-500/10">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-500/10">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      {canManage && (
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEdit(book)}
                              className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Edit Book Specifications"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you absolutely sure you want to delete ${book.title}?`)) {
                                  onDeleteBook(book.bookId);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              title="Delete Book Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Form Overlay Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 bg-blue-950 text-white flex items-center justify-between">
                  <h3 className="font-display font-semibold text-base">
                    {editingBook ? 'Edit Book Specifications' : 'Catalog New Book'}
                  </h3>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Body */}
                <form id="book-catalog-form" onSubmit={handleSaveBook} className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                      placeholder="e.g. Introduction to Algorithms"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      First Author & Contributors *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                      placeholder="e.g. Thomas H. Cormen"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Subject Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Tech">Information Tech</option>
                      <option value="Networking">Networking</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Software Engineering">Software Engineering</option>
                    </select>
                  </div>

                  {/* Copies split */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Total Physical Copies
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={totalCopies}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTotalCopies(val);
                          if (!editingBook) setAvailableCopies(val); // default match on add
                        }}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Available For Loan
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={totalCopies}
                        required
                        disabled={!editingBook}
                        value={availableCopies}
                        onChange={(e) => setAvailableCopies(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Book Cover URL (Optional Unsplash Link)
                    </label>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </form>

                {/* Footer buttons */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="book-catalog-form"
                    className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer"
                  >
                    Save Specifications
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Book Specifications Drawer Panel */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                      {selectedBook.bookId}
                    </span>
                    <h3 className="font-display font-semibold text-base mt-1 text-white">Book Information Sheet</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="p-1.5 text-slate-450 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Large Cover / Art */}
                  <div className="aspect-[4/3] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden shadow-xs">
                    {selectedBook.cover ? (
                      <img 
                        src={selectedBook.cover} 
                        alt={selectedBook.title} 
                        className="h-full object-cover rounded-xl shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <BookOpen className="h-20 w-20 text-slate-200" />
                    )}
                  </div>

                  {/* Core Titles */}
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-900">
                      {selectedBook.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-950 font-display leading-snug">{selectedBook.title}</h4>
                    <p className="text-slate-500 text-xs font-semibold">Author: <span className="text-slate-800">{selectedBook.author}</span></p>
                  </div>

                  {/* Micro specs */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-150">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-105">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Inventory Ratio</span>
                      <span className="block text-sm font-bold text-slate-900 mt-1">
                        {selectedBook.availableCopies} available
                      </span>
                      <span className="block text-[10px] text-slate-550 mt-0.5">out of {selectedBook.totalCopies} total</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-105">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Circulation Status</span>
                      <span className="block mt-1 font-semibold">
                        {selectedBook.availableCopies > 0 ? (
                          <span className="text-emerald-650 text-xs font-bold inline-flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> In Library Stock
                          </span>
                        ) : (
                          <span className="text-rose-650 text-xs font-bold inline-flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span> Fully Checkout out
                          </span>
                        )}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">Physical tracking spec</span>
                    </div>
                  </div>

                  {/* Book Synopsis & Review Mock-Up */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Catalogue Metadata Details</h5>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      This volume is curated in our <strong>{selectedBook.category}</strong> curriculum section. It contains foundational academic guidance and comprehensive study specifications for undergrad coursework, conforming to standard reference guidelines.
                    </p>
                  </div>

                  {/* Mock reviews */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-105">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-slate-850">Average Rating</span>
                      <span className="text-amber-500">★ 4.8 / 5.0 (Student polls)</span>
                    </div>
                    <p className="text-[11px] text-slate-450 italic">
                      "Highly requested syllabus reference text. Updated index covers modern practical specifications."
                    </p>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                  <div className="text-[11px] text-slate-400">
                    CS3140 Campus Logistics
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-white cursor-pointer"
                    >
                      Close Details
                    </button>
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => {
                          const bookToEdit = selectedBook;
                          setSelectedBook(null);
                          handleOpenEdit(bookToEdit);
                        }}
                        className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer flex items-center space-x-1.5"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit specs</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
