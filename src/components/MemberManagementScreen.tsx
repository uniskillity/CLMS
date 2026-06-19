import React, { useState } from 'react';
import { Member, UserProfile } from '../types';
import { Search, Plus, Edit, Trash2, X, Users, Mail, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberManagementScreenProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  user: UserProfile;
}

export default function MemberManagementScreen({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  user
}: MemberManagementScreenProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setStatus(member.status);
    setIsFormOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    if (editingMember) {
      const updated: Member = {
        ...editingMember,
        name,
        email,
        phone,
        status
      };
      onEditMember(updated);
    } else {
      const newId = `M00${members.length + 1}`;
      const newMem: Member = {
        memberId: newId,
        name,
        email,
        phone,
        joinDate: new Date().toISOString().split('T')[0],
        status
      };
      onAddMember(newMem);
    }
    setIsFormOpen(false);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search and Action Ribbon */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            placeholder="Search Member ID, name, email, or telephone..."
          />
        </div>

        {/* Add Member Button */}
        <button
          onClick={handleOpenAdd}
          className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Members Database Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="px-6 py-4">Member ID</th>
                <th className="px-6 py-4">General Contact Profiles</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">University Join Date</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No registered campus members match search attributes.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.memberId} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[11px] text-slate-500">{member.memberId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {member.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{member.name}</div>
                          <div className="text-slate-400 text-[10px] mt-0.5 flex items-center space-x-1">
                            <Mail className="h-3 w-3 inline text-slate-300" />
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{member.joinDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.status === 'Active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-500/10">
                          Active Loan Privilege
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-500/10">
                          Account Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                          title="Modify Profiling Credentials"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you absolutely sure you want to delete ${member.name}?`)) {
                              onDeleteMember(member.memberId);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                          title="Purge Active Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Member Details Form Component */}
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

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="px-6 py-5 bg-blue-950 text-white flex items-center justify-between">
                  <h3 className="font-display font-semibold text-base">
                    {editingMember ? 'Modify Profiling Credentials' : 'Register New Campus Member'}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Body */}
                <form id="member-profile-form" onSubmit={handleSaveMember} className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      placeholder="e.g. Liam Christopher"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Campus Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      placeholder="e.g. liam.c@university.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Telephone / Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      placeholder="e.g. 555-0100"
                    />
                  </div>

                  {editingMember && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Circulation Privileges
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      >
                        <option value="Active">Active (In compliance with loans rules)</option>
                        <option value="Suspended">Suspended (Blocked due to outstanding fines)</option>
                      </select>
                    </div>
                  )}
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
                    form="member-profile-form"
                    className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer"
                  >
                    Save Registration
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
