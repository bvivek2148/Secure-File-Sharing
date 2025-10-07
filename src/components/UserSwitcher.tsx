import { Users, Plus } from 'lucide-react';
import { useState } from 'react';
import { storageManager, User } from '../utils/storage';

interface UserSwitcherProps {
  currentUser: User;
  onUserChange: (user: User) => void;
}

export function UserSwitcher({ currentUser, onUserChange }: UserSwitcherProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const users = storageManager.getAllUsers();

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      alert('Please enter both name and email');
      return;
    }

    const user = storageManager.addUser(newUserEmail, newUserName);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUser(false);
    onUserChange(user);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <Users className="w-5 h-5 text-slate-600" />
        <span className="text-sm font-medium text-slate-800">{currentUser.displayName}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setShowMenu(false);
              setShowAddUser(false);
            }}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-20">
            <div className="p-2 border-b border-slate-200">
              <p className="text-xs font-medium text-slate-600 px-3 py-2">Switch User</p>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserChange(user);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    user.id === currentUser.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-xs text-slate-600">{user.email}</div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-slate-200">
              {!showAddUser ? (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New User
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserName('');
                        setNewUserEmail('');
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
