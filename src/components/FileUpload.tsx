import { useState } from 'react';
import { Upload, Key, Lock } from 'lucide-react';
import { encryptFile, generateRandomKey } from '../utils/crypto';
import { storageManager } from '../utils/storage';

interface FileUploadProps {
  onUploadComplete: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateKey = () => {
    const key = generateRandomKey(16);
    setEncryptionKey(key);
    setShowKey(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !encryptionKey) return;

    if (encryptionKey.length < 7) {
      alert('Encryption key must be at least 7 characters long');
      return;
    }

    setIsUploading(true);
    try {
      const encrypted = await encryptFile(selectedFile, encryptionKey);
      storageManager.storeFile(encrypted);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      setSelectedFile(null);
      setEncryptionKey('');
      setShowKey(false);
      onUploadComplete();

      alert('File encrypted and uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Upload Secure File</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select File
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: <span className="font-medium">{selectedFile.name}</span> (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Encryption Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Enter or generate encryption key"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {encryptionKey && (
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Key className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
            <button
              onClick={handleGenerateKey}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Generate
            </button>
          </div>
          {encryptionKey && encryptionKey.length < 7 && (
            <p className="mt-2 text-xs text-red-600 flex items-start gap-1">
              <span className="font-medium">⚠️</span>
              <span>
                Key must be at least 7 characters long.
              </span>
            </p>
          )}
          {encryptionKey && encryptionKey.length >= 7 && (
            <p className="mt-2 text-xs text-amber-600 flex items-start gap-1">
              <span className="font-medium">⚠️ Important:</span>
              <span>
                Save this key securely. You'll need it to decrypt the file later.
              </span>
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || !encryptionKey || encryptionKey.length < 7 || isUploading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Encrypting & Uploading...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Encrypt & Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
}
