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

## Testing the File Sharing

This demo includes a user switcher feature to test file sharing:

1. Click on your username in the top-right corner
2. Click "Add New User" to create additional test users
3. Switch between users to test the sharing workflow
4. Share a file from User A and then switch to User B to see it in "Shared With Me"

## Security Notes

- **Encryption**: Files are encrypted using IDEA cipher (128-bit key)
- **Double Encryption**: When sharing, the file key is encrypted with a recipient password
- **Keys**: Original encryption keys are NEVER stored - only their hashes for verification
- **Client-side**: All encryption/decryption happens in your browser
- **Access Control**: Files can only be accessed by the owner and users they've shared with
- **Secure Key Transfer**: File keys are encrypted before sharing, ensuring end-to-end security
- **Audit Trail**: All file operations are logged

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
4. **Regular Backups**: The demo uses localStorage, so clearing browser data will delete files.
5. **Secure Sharing**: When sharing files, use strong recipient passwords and share them through secure channels.
6. **Two-Layer Security**: The system uses two layers of encryption - one for the file and one for the key during sharing.
