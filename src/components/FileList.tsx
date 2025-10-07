import { useState } from 'react';
import { File, Download, Trash2, Share2, Clock, User, Key } from 'lucide-react';
import { StoredFile, storageManager } from '../utils/storage';
import { decryptFile, downloadBlob } from '../utils/crypto';

interface FileListProps {
  files: StoredFile[];
  onFileChange: () => void;
  showSharedBy?: boolean;
}

export function FileList({ files, onFileChange, showSharedBy = false }: FileListProps) {
  const [decryptingFileId, setDecryptingFileId] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [sharingFileId, setSharingFileId] = useState<string | null>(null);

  const handleDecrypt = async (file: StoredFile) => {
    if (!decryptionKey) {
      alert('Please enter the decryption key');
      return;
    }

    if (decryptionKey.length < 7) {
      alert('Decryption key must be at least 7 characters long');
      return;
    }

    try {
      const blob = await decryptFile(file, decryptionKey);
      downloadBlob(blob, file.filename);

      storageManager.logAccess(file.id, storageManager.getCurrentUser().id, 'decrypt');
      storageManager.logAccess(file.id, storageManager.getCurrentUser().id, 'download');

      setDecryptingFileId(null);
      setDecryptionKey('');
      alert('File decrypted and downloaded successfully!');
    } catch (error) {
      console.error('Decryption error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to decrypt file: ${errorMessage}\nPlease check your decryption key and try again.`);
    }
  };

  const handleDelete = (fileId: string, filename: string) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      if (storageManager.deleteFile(fileId)) {
        onFileChange();
        alert('File deleted successfully');
      } else {
        alert('Failed to delete file');
      }
    }
  };

  const handleShare = (fileId: string) => {
    setSharingFileId(fileId);
  };

  const handleShareSubmit = (fileId: string, userId: string) => {
    if (storageManager.shareFile(fileId, userId, false)) {
      setSharingFileId(null);
      onFileChange();
      alert('File shared successfully');
    } else {
      alert('Failed to share file');
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 border border-slate-200 text-center">
        <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">No files found</p>
        <p className="text-slate-400 text-sm mt-2">
          {showSharedBy
            ? 'Files shared with you will appear here'
            : 'Upload your first encrypted file to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white rounded-lg shadow-md p-5 border border-slate-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-slate-100 rounded-lg">
                <File className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-800 truncate">
                  {file.filename}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {showSharedBy ? file.ownerName : 'You'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {file.createdAt.toLocaleDateString()}
                  </span>
                  <span>{(file.fileSize / 1024).toFixed(2)} KB</span>
                </div>
                {file.sharedWith.length > 0 && !showSharedBy && (
                  <div className="mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      Shared with {file.sharedWith.length} user(s)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {!showSharedBy && (
                <>
                  <button
                    onClick={() => handleShare(file.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id, file.filename)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={() => setDecryptingFileId(file.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Decrypt
              </button>
            </div>
          </div>

          {decryptingFileId === file.id && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter Decryption Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  placeholder="Enter your encryption key"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDecrypt(file);
                    }
                  }}
                />
                <button
                  onClick={() => handleDecrypt(file)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Decrypt
                </button>
                <button
                  onClick={() => {
                    setDecryptingFileId(null);
                    setDecryptionKey('');
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {sharingFileId === file.id && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Share with User
              </label>
              <div className="space-y-2">
                {storageManager
                  .getAllUsers()
                  .filter((u) => u.id !== storageManager.getCurrentUser().id)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleShareSubmit(file.id, user.id)}
                      className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-slate-800">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setSharingFileId(null)}
                className="w-full mt-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
