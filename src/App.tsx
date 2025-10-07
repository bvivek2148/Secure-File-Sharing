import { useState, useEffect } from 'react';
import { Shield, FileText, Share2, Activity } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { AccessLogs } from './components/AccessLogs';
import { UserSwitcher } from './components/UserSwitcher';
import { storageManager, StoredFile, AccessLog, User } from './utils/storage';

type Tab = 'upload' | 'my-files' | 'shared' | 'logs';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [myFiles, setMyFiles] = useState<StoredFile[]>([]);
  const [sharedFiles, setSharedFiles] = useState<StoredFile[]>([]);
  const [selectedFileForLogs, setSelectedFileForLogs] = useState<string | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [currentUser, setCurrentUser] = useState(storageManager.getCurrentUser());

  const loadFiles = () => {
    setMyFiles(storageManager.getUserFiles());
    setSharedFiles(storageManager.getSharedWithMeFiles());
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUploadComplete = () => {
    loadFiles();
    setActiveTab('my-files');
  };

  const handleFileChange = () => {
    loadFiles();
  };

  const handleViewLogs = (fileId: string) => {
    const logs = storageManager.getAccessLogs(fileId);
    setAccessLogs(logs);
    setSelectedFileForLogs(fileId);
    setActiveTab('logs');
  };

  const handleUserChange = (user: User) => {
    storageManager.setCurrentUser(user.id);
    setCurrentUser(user);
    loadFiles();
  };

  const handleLogout = () => {
    storageManager.logout();
    setCurrentUser(storageManager.getCurrentUser());
    loadFiles();
    setActiveTab('upload');
  };

  const tabs = [
    { id: 'upload' as Tab, label: 'Upload', icon: Shield },
    { id: 'my-files' as Tab, label: 'My Files', icon: FileText },
    { id: 'shared' as Tab, label: 'Shared With Me', icon: Share2 },
    { id: 'logs' as Tab, label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Secure File Sharing
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  End-to-end encryption with IDEA cipher
                </p>
              </div>
            </div>
            <UserSwitcher
              currentUser={currentUser}
              onUserChange={handleUserChange}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <FileUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {activeTab === 'my-files' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">My Files</h2>
              <p className="text-slate-600 mt-1">
                Files you've uploaded and encrypted
              </p>
            </div>
            <FileList files={myFiles} onFileChange={handleFileChange} />
          </div>
        )}

        {activeTab === 'shared' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Shared With Me
              </h2>
              <p className="text-slate-600 mt-1">
                Files that others have shared with you
              </p>
            </div>
            <FileList
              files={sharedFiles}
              onFileChange={handleFileChange}
              showSharedBy={true}
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Activity Logs
              </h2>
              <p className="text-slate-600 mt-1">
                Track file access and operations
              </p>
            </div>
            {myFiles.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select a file to view logs
                  </label>
                  <select
                    value={selectedFileForLogs || ''}
                    onChange={(e) => {
                      const fileId = e.target.value;
                      setSelectedFileForLogs(fileId);
                      setAccessLogs(storageManager.getAccessLogs(fileId));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a file...</option>
                    {myFiles.map((file) => (
                      <option key={file.id} value={file.id}>
                        {file.filename}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedFileForLogs && <AccessLogs logs={accessLogs} />}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 border border-slate-200 text-center">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No files available</p>
                <p className="text-slate-400 text-sm mt-2">
                  Upload files to view their activity logs
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>All files are encrypted with IDEA cipher</span>
            </div>
            <div>
              <span className="font-medium">Secure File Sharing System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
