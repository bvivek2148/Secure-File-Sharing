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

### 4. Share a File
1. Go to **My Files**
2. Click the share icon on any file
3. Select a user to share with
4. The user will see the file in their "Shared With Me" tab

### 5. View Shared Files
1. Go to the **Shared With Me** tab
2. You'll see all files others have shared with you
3. Use the same decryption process to download them

### 6. Check Activity Logs
1. Go to the **Activity Logs** tab
2. Select a file from the dropdown
3. View all access events including:
   - Who accessed the file
   - What action they performed (upload, view, download, decrypt, share)
   - When it happened

## Security Notes

- **Encryption**: Files are encrypted using IDEA cipher (128-bit key)
- **Keys**: Encryption keys are NEVER stored - only their hashes for verification
- **Client-side**: All encryption/decryption happens in your browser
- **Access Control**: Files can only be accessed by the owner and users they've shared with
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
5. **Key Sharing**: Share encryption keys through secure channels (not email!).
