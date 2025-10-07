# Secure File Sharing System - User Guide

## Overview
This is a secure file sharing system that uses the IDEA cipher (International Data Encryption Algorithm) for end-to-end encryption of files. All encryption and decryption happens in your browser.

## Features
- **Upload & Encrypt**: Upload files and encrypt them with a custom or auto-generated key
- **Secure Storage**: Files are stored encrypted (in localStorage for demo)
- **File Sharing**: Share encrypted files with other users
- **Decrypt & Download**: Decrypt files using the encryption key
- **Activity Logs**: Track all file access and operations
- **Access Control**: Fine-grained permissions for file sharing

## How to Use

### 1. Upload a File
1. Go to the **Upload** tab
2. Click "Select File" and choose a file from your computer
3. Enter a custom encryption key (at least 7 characters) OR click "Generate" to create a random key
4. **IMPORTANT**: Save the encryption key securely - you'll need it to decrypt the file later
5. Click "Encrypt & Upload"

### 2. View Your Files
1. Go to the **My Files** tab
2. You'll see all files you've uploaded
3. Each file shows:
   - Filename
   - Upload date
   - File size
   - Number of users it's shared with

### 3. Decrypt and Download a File
1. Find the file you want to download
2. Click the "Decrypt" button
3. Enter your encryption key
4. Click "Decrypt" to download the file

### 4. Share a File with Secure Key Transfer
1. Go to **My Files**
2. Click the share icon on any file
3. Enter your original file encryption key
4. Create a recipient password (min 7 characters) - this protects the key during transfer
5. Select the user to share with
6. **IMPORTANT**: Save the recipient password shown in the confirmation - you must share it with the recipient securely
7. The recipient will see the file in their "Shared With Me" tab

### 5. View and Download Shared Files
1. Go to the **Shared With Me** tab
2. You'll see all files others have shared with you
3. Click "Decrypt" on a shared file
4. Enter the recipient password that was shared with you (NOT the original file key)
5. The system will automatically decrypt the file key and download the file

### 6. Check Activity Logs
1. Go to the **Activity Logs** tab
2. Select a file from the dropdown
3. View all access events including:
   - Who accessed the file
   - What action they performed (upload, view, download, decrypt, share)
   - When it happened

## User Management

The system includes two default demo accounts:

- **Alice Johnson** (alice@example.com)
- **Bob Smith** (bob@example.com)

### Switching Users

1. Click on your username in the top-right corner
2. Select another user to switch to their account
3. All files and data are preserved between switches

### Adding New Users

1. Click on your username in the top-right corner
2. Click "Add New User"
3. Enter name and email
4. The new user will be available for switching and file sharing

### Logout

1. Click on your username in the top-right corner
2. Click "Logout" to switch back to the first default user (Alice)

## Testing the File Sharing

To test the complete file sharing workflow:

1. Login as Alice Johnson
2. Upload a file with an encryption key
3. Share the file with Bob Smith (create a recipient password)
4. Logout or switch to Bob Smith
5. Go to "Shared With Me" tab
6. Download the shared file using the recipient password

## Data Persistence

All data is stored in your browser's localStorage and persists across sessions:

- **Files remain encrypted** and stored until you explicitly delete them
- **User accounts** are saved and persist
- **File shares** are maintained across browser sessions
- **Access logs** are preserved for auditing
- **Clear browser data** will delete all stored files and accounts

## Security Notes

- **Encryption**: Files are encrypted using IDEA cipher (128-bit key)
- **Double Encryption**: When sharing, the file key is encrypted with a recipient password
- **Keys**: Original encryption keys are NEVER stored - only their hashes for verification
- **Client-side**: All encryption/decryption happens in your browser
- **Access Control**: Files can only be accessed by the owner and users they've shared with
- **Secure Key Transfer**: File keys are encrypted before sharing, ensuring end-to-end security
- **Audit Trail**: All file operations are logged
- **Persistent Storage**: Data is stored locally and remains until explicitly deleted

## Technical Details

- **Algorithm**: IDEA (International Data Encryption Algorithm)
- **Key Size**: 128-bit
- **Block Size**: 64-bit (8 bytes)
- **Mode**: ECB (Electronic Codebook)
- **Key Requirements**: Minimum 7 characters

## Tips

1. **Save Your Keys**: Always save encryption keys securely. Without the key, files cannot be decrypted.
2. **Strong Keys**: Use long, complex keys with letters, numbers, and symbols.
3. **Unique Keys**: Use different keys for different files for better security.
4. **Data Backup**: Export important files before clearing browser data - localStorage clears will delete everything.
5. **Secure Sharing**: When sharing files, use strong recipient passwords and share them through secure channels.
6. **Two-Layer Security**: The system uses two layers of encryption - one for the file and one for the key during sharing.
7. **Demo Accounts**: The system starts with two demo accounts (Alice and Bob) - perfect for testing file sharing.
8. **Data Persistence**: All uploaded files and user data persist permanently in localStorage until you delete them.
