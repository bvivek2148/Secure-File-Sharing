import { EncryptedFile } from './crypto';

export interface StoredFile extends EncryptedFile {
  id: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  sharedWith: string[];
}

export interface FileShare {
  fileId: string;
  sharedBy: string;
  sharedWith: string;
  canReshare: boolean;
  expiresAt?: Date;
  createdAt: Date;
  encryptedKey?: string;
}

export interface AccessLog {
  fileId: string;
  userId: string;
  action: 'upload' | 'view' | 'download' | 'decrypt' | 'share';
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

class FileStorageManager {
  private files: Map<string, StoredFile> = new Map();
  private shares: FileShare[] = [];
  private accessLogs: AccessLog[] = [];
  private users: Map<string, User> = new Map();
  private currentUser: User | null = null;

  constructor() {
    this.loadFromLocalStorage();
    this.initDefaultUser();
  }

  private initDefaultUser(): void {
    if (this.users.size === 0) {
      const defaultUser: User = {
        id: 'user-1',
        email: 'demo@example.com',
        displayName: 'Demo User',
      };
      this.users.set(defaultUser.id, defaultUser);
      this.currentUser = defaultUser;
      this.saveToLocalStorage();
    } else {
      this.currentUser = Array.from(this.users.values())[0];
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const filesData = localStorage.getItem('secureFiles');
      const sharesData = localStorage.getItem('fileShares');
      const logsData = localStorage.getItem('accessLogs');
      const usersData = localStorage.getItem('users');

      if (filesData) {
        const parsed = JSON.parse(filesData);
        this.files = new Map(
          parsed.map((f: any) => [
            f.id,
            { ...f, createdAt: new Date(f.createdAt) },
          ])
        );
      }

      if (sharesData) {
        this.shares = JSON.parse(sharesData).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          expiresAt: s.expiresAt ? new Date(s.expiresAt) : undefined,
        }));
      }

      if (logsData) {
        this.accessLogs = JSON.parse(logsData).map((l: any) => ({
          ...l,
          timestamp: new Date(l.timestamp),
        }));
      }

      if (usersData) {
        const parsed = JSON.parse(usersData);
        this.users = new Map(parsed.map((u: User) => [u.id, u]));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(
        'secureFiles',
        JSON.stringify(Array.from(this.files.values()))
      );
      localStorage.setItem('fileShares', JSON.stringify(this.shares));
      localStorage.setItem('accessLogs', JSON.stringify(this.accessLogs));
      localStorage.setItem('users', JSON.stringify(Array.from(this.users.values())));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getCurrentUser(): User {
    return this.currentUser!;
  }

  setCurrentUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    this.currentUser = user;
    return true;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  addUser(email: string, displayName: string): User {
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      displayName,
    };
    this.users.set(user.id, user);
    this.saveToLocalStorage();
    return user;
  }

  storeFile(encryptedFile: EncryptedFile): string {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const storedFile: StoredFile = {
      ...encryptedFile,
      id: fileId,
      ownerId: this.currentUser!.id,
      ownerName: this.currentUser!.displayName,
      createdAt: new Date(),
      sharedWith: [],
    };

    this.files.set(fileId, storedFile);
    this.logAccess(fileId, this.currentUser!.id, 'upload');
    this.saveToLocalStorage();

    return fileId;
  }

  getFile(fileId: string): StoredFile | null {
    const file = this.files.get(fileId);
    if (!file) return null;

    if (!this.canAccessFile(fileId, this.currentUser!.id)) {
      return null;
    }

    this.logAccess(fileId, this.currentUser!.id, 'view');
    return file;
  }

  getUserFiles(): StoredFile[] {
    return Array.from(this.files.values()).filter(
      (file) => file.ownerId === this.currentUser!.id
    );
  }

  getSharedWithMeFiles(): StoredFile[] {
    return Array.from(this.files.values()).filter((file) =>
      this.canAccessFile(file.id, this.currentUser!.id) && file.ownerId !== this.currentUser!.id
    );
  }

  canAccessFile(fileId: string, userId: string): boolean {
    const file = this.files.get(fileId);
    if (!file) return false;

    if (file.ownerId === userId) return true;

    const share = this.shares.find(
      (s) =>
        s.fileId === fileId &&
        s.sharedWith === userId &&
        (!s.expiresAt || s.expiresAt > new Date())
    );

    return !!share;
  }

  shareFile(
    fileId: string,
    sharedWithUserId: string,
    canReshare: boolean = false,
    expiresAt?: Date,
    encryptedKey?: string
  ): boolean {
    const file = this.files.get(fileId);
    if (!file) return false;

    if (file.ownerId !== this.currentUser!.id) {
      const existingShare = this.shares.find(
        (s) =>
          s.fileId === fileId &&
          s.sharedWith === this.currentUser!.id &&
          s.canReshare
      );
      if (!existingShare) return false;
    }

    const existingShare = this.shares.find(
      (s) => s.fileId === fileId && s.sharedWith === sharedWithUserId
    );

    if (existingShare) {
      existingShare.canReshare = canReshare;
      existingShare.expiresAt = expiresAt;
      if (encryptedKey) {
        existingShare.encryptedKey = encryptedKey;
      }
    } else {
      const share: FileShare = {
        fileId,
        sharedBy: this.currentUser!.id,
        sharedWith: sharedWithUserId,
        canReshare,
        expiresAt,
        createdAt: new Date(),
        encryptedKey,
      };
      this.shares.push(share);

      if (!file.sharedWith.includes(sharedWithUserId)) {
        file.sharedWith.push(sharedWithUserId);
      }
    }

    this.logAccess(fileId, this.currentUser!.id, 'share');
    this.saveToLocalStorage();
    return true;
  }

  getFileShares(fileId: string): FileShare[] {
    const file = this.files.get(fileId);
    if (!file || file.ownerId !== this.currentUser!.id) return [];

    return this.shares.filter((s) => s.fileId === fileId);
  }

  revokeShare(fileId: string, sharedWithUserId: string): boolean {
    const file = this.files.get(fileId);
    if (!file || file.ownerId !== this.currentUser!.id) return false;

    const index = this.shares.findIndex(
      (s) => s.fileId === fileId && s.sharedWith === sharedWithUserId
    );

    if (index !== -1) {
      this.shares.splice(index, 1);

      const shareIndex = file.sharedWith.indexOf(sharedWithUserId);
      if (shareIndex !== -1) {
        file.sharedWith.splice(shareIndex, 1);
      }

      this.saveToLocalStorage();
      return true;
    }

    return false;
  }

  deleteFile(fileId: string): boolean {
    const file = this.files.get(fileId);
    if (!file || file.ownerId !== this.currentUser!.id) return false;

    this.files.delete(fileId);
    this.shares = this.shares.filter((s) => s.fileId !== fileId);
    this.accessLogs = this.accessLogs.filter((l) => l.fileId !== fileId);

    this.saveToLocalStorage();
    return true;
  }

  logAccess(
    fileId: string,
    userId: string,
    action: AccessLog['action']
  ): void {
    const log: AccessLog = {
      fileId,
      userId,
      action,
      timestamp: new Date(),
    };
    this.accessLogs.push(log);
    this.saveToLocalStorage();
  }

  getAccessLogs(fileId: string): AccessLog[] {
    const file = this.files.get(fileId);
    if (!file || file.ownerId !== this.currentUser!.id) return [];

    return this.accessLogs
      .filter((l) => l.fileId === fileId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getFileShare(fileId: string, userId: string): FileShare | undefined {
    return this.shares.find(
      (s) =>
        s.fileId === fileId &&
        s.sharedWith === userId &&
        (!s.expiresAt || s.expiresAt > new Date())
    );
  }

  clearAllData(): void {
    this.files.clear();
    this.shares = [];
    this.accessLogs = [];
    this.users.clear();
    this.currentUser = null;
    localStorage.removeItem('secureFiles');
    localStorage.removeItem('fileShares');
    localStorage.removeItem('accessLogs');
    localStorage.removeItem('users');
    this.initDefaultUser();
  }
}

export const storageManager = new FileStorageManager();
