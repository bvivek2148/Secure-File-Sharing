import IDEA from 'idea-cipher';

export interface EncryptedFile {
  filename: string;
  encryptedData: string;
  fileSize: number;
  mimeType: string;
  encryptionKeyHash: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

async function hashKey(key: string): Promise<string> {
  const keyBytes = stringToBytes(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyBytes);
  return arrayBufferToBase64(hashBuffer);
}

export async function encryptFile(file: File, encryptionKey: string): Promise<EncryptedFile> {
  const fileData = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileData);

  const cipher = new IDEA(encryptionKey);
  const encryptedBytes = cipher.encrypt(fileBytes);

  const encryptedBase64 = arrayBufferToBase64(encryptedBytes.buffer);
  const keyHash = await hashKey(encryptionKey);

  return {
    filename: file.name,
    encryptedData: encryptedBase64,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    encryptionKeyHash: keyHash,
  };
}

export async function decryptFile(
  encryptedFile: EncryptedFile,
  decryptionKey: string
): Promise<Blob> {
  const keyHash = await hashKey(decryptionKey);

  if (keyHash !== encryptedFile.encryptionKeyHash) {
    throw new Error('Invalid decryption key');
  }

  const encryptedBytes = new Uint8Array(base64ToArrayBuffer(encryptedFile.encryptedData));

  const cipher = new IDEA(decryptionKey);
  const decryptedBytes = cipher.decrypt(encryptedBytes);

  let actualSize = decryptedBytes.length;
  while (actualSize > 0 && decryptedBytes[actualSize - 1] === 0) {
    actualSize--;
  }

  const trimmedBytes = decryptedBytes.slice(0, actualSize);

  return new Blob([trimmedBytes], { type: encryptedFile.mimeType });
}

export function generateRandomKey(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars[randomValues[i] % chars.length];
  }

  return key;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
