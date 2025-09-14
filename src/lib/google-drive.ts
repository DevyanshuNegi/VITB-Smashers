import { google } from 'googleapis';

// Initialize Google Drive API with service account
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

if (!privateKey || !clientEmail) {
  throw new Error('Google service account credentials are not configured');
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: privateKey,
    client_email: clientEmail,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink?: string;
  size?: string;
}

export interface SharePermission {
  type: 'user' | 'anyone';
  role: 'reader' | 'writer' | 'commenter';
  emailAddress?: string;
}

/**
 * Check if a folder exists and is accessible
 */
export async function checkFolderExists(folderId: string): Promise<boolean> {
  console.log('Checking folder existence for ID:', folderId);
  try {
    await drive.files.get({
      fileId: folderId,
      fields: 'id, name',
      supportsAllDrives: true,
    });
    return true;
  } catch (error) {
    console.error('Folder not found or not accessible:', error);
    return false;
  }
}

/**
 * Get shortcut folders within a parent folder
 */
export async function getShortcutFolders(parentFolderId: string): Promise<string[]> {
  try {
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.shortcut' and trashed=false`,
      fields: 'files(id, name, shortcutDetails)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const shortcutTargets: string[] = [];
    
    if (response.data.files) {
      for (const file of response.data.files) {
        if (file.shortcutDetails?.targetId) {
          console.log(`Found shortcut: ${file.name} -> ${file.shortcutDetails.targetId}`);
          shortcutTargets.push(file.shortcutDetails.targetId);
        }
      }
    }

    return shortcutTargets;
  } catch (error) {
    console.error('Error fetching shortcut folders:', error);
    return [];
  }
}

/**
 * Grant access to a Google Drive folder for a specific user
 * Also grants access to any shortcut folders within the main folder
 */
export async function grantFolderAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    // First check if the folder exists and is accessible
    const folderExists = await checkFolderExists(folderId);
    if (!folderExists) {
      console.error(`Folder ${folderId} not found or not accessible by service account`);
      return false;
    }

    // Grant access to the main folder
    console.log(`Granting access to main folder ${folderId} for user ${userEmail}`);
    await drive.permissions.create({
      fileId: folderId,
      supportsAllDrives: true,
      requestBody: {
        role: 'reader',
        type: 'user',
        emailAddress: userEmail,
      },
      sendNotificationEmail: true,
      emailMessage: 'You now have access to your purchased notes from NotesHub!',
    });

    // Get all shortcut folders within the main folder
    const shortcutTargets = await getShortcutFolders(folderId);
    
    if (shortcutTargets.length > 0) {
      console.log(`Found ${shortcutTargets.length} shortcut folders to grant access to`);
      
      // Grant access to each shortcut target folder
      for (const targetFolderId of shortcutTargets) {
        try {
          console.log(`Granting access to shortcut target folder ${targetFolderId}`);
          await drive.permissions.create({
            fileId: targetFolderId,
            supportsAllDrives: true,
            requestBody: {
              role: 'reader',
              type: 'user',
              emailAddress: userEmail,
            },
            sendNotificationEmail: false, // Don't send email for each shortcut
          });
        } catch (shortcutError) {
          console.error(`Failed to grant access to shortcut folder ${targetFolderId}:`, shortcutError);
          // Continue with other shortcuts even if one fails
        }
      }
    } else {
      console.log('No shortcut folders found in the main folder');
    }
    
    return true;
  } catch (error) {
    console.error('Error granting folder access:', error);
    return false;
  }
}

/**
 * Get folder contents (files, subfolders, and shortcuts)
 */
export async function getFolderContents(folderId: string): Promise<DriveFile[]> {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, size, shortcutDetails)',
      orderBy: 'name',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    const files: DriveFile[] = [];
    
    if (response.data.files) {
      for (const file of response.data.files) {
        if (file.mimeType === 'application/vnd.google-apps.shortcut') {
          // Handle shortcuts - get the target file details
          if (file.shortcutDetails?.targetId) {
            try {
              const targetFile = await drive.files.get({
                fileId: file.shortcutDetails.targetId,
                fields: 'id, name, mimeType, webViewLink, webContentLink, size',
                supportsAllDrives: true,
              });
              
              files.push({
                id: file.shortcutDetails.targetId,
                name: `${file.name} (Shortcut)`,
                mimeType: targetFile.data.mimeType!,
                webViewLink: targetFile.data.webViewLink!,
                webContentLink: targetFile.data.webContentLink ?? undefined,
                size: targetFile.data.size ?? undefined,
              });
            } catch (error) {
              console.error(`Error fetching shortcut target for ${file.name}:`, error);
              // Add the shortcut itself if we can't get target details
              files.push({
                id: file.id!,
                name: `${file.name} (Shortcut - Target Inaccessible)`,
                mimeType: file.mimeType || 'application/vnd.google-apps.shortcut',
                webViewLink: file.webViewLink!,
                webContentLink: file.webContentLink ?? undefined,
                size: file.size ?? undefined,
              });
            }
          }
        } else {
          // Regular file or folder
          files.push({
            id: file.id!,
            name: file.name!,
            mimeType: file.mimeType!,
            webViewLink: file.webViewLink!,
            webContentLink: file.webContentLink ?? undefined,
            size: file.size ?? undefined,
          });
        }
      }
    }

    return files;
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw new Error('Failed to fetch folder contents');
  }
}

/**
 * Create a shareable link for a folder
 */
export async function createShareableLink(folderId: string): Promise<string> {
  try {
    // Make the folder viewable by anyone with the link
    await drive.permissions.create({
      fileId: folderId,
      supportsAllDrives: true,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the folder details to return the webViewLink
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'webViewLink',
      supportsAllDrives: true,
    });

    return response.data.webViewLink ?? '';
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw new Error('Failed to create shareable link');
  }
}

/**
 * Revoke access to a folder for a specific user
 * Also revokes access from any shortcut folders within the main folder
 */
export async function revokeFolderAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    let success = false;

    // Revoke access from the main folder
    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id, emailAddress, type)',
      supportsAllDrives: true,
    });

    const userPermission = permissions.data.permissions?.find(
      (perm) => perm.emailAddress === userEmail && perm.type === 'user'
    );

    if (userPermission?.id) {
      await drive.permissions.delete({
        fileId: folderId,
        permissionId: userPermission.id,
        supportsAllDrives: true,
      });
      success = true;
      console.log(`Revoked access to main folder ${folderId} for user ${userEmail}`);
    }

    // Get and revoke access from shortcut folders
    const shortcutTargets = await getShortcutFolders(folderId);
    
    for (const targetFolderId of shortcutTargets) {
      try {
        const targetPermissions = await drive.permissions.list({
          fileId: targetFolderId,
          fields: 'permissions(id, emailAddress, type)',
          supportsAllDrives: true,
        });

        const targetUserPermission = targetPermissions.data.permissions?.find(
          (perm) => perm.emailAddress === userEmail && perm.type === 'user'
        );

        if (targetUserPermission?.id) {
          await drive.permissions.delete({
            fileId: targetFolderId,
            permissionId: targetUserPermission.id,
            supportsAllDrives: true,
          });
          console.log(`Revoked access to shortcut folder ${targetFolderId} for user ${userEmail}`);
        }
      } catch (error) {
        console.error(`Error revoking access from shortcut folder ${targetFolderId}:`, error);
      }
    }

    return success;
  } catch (error) {
    console.error('Error revoking folder access:', error);
    return false;
  }
}

/**
 * Check if a user has access to a folder and its shortcuts
 */
export async function checkUserAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    // Check access to main folder
    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(emailAddress, type, role)',
      supportsAllDrives: true,
    });

    const hasMainAccess = permissions.data.permissions?.some(
      (perm) => perm.emailAddress === userEmail && perm.type === 'user'
    ) ?? false;

    if (hasMainAccess) {
      console.log(`User ${userEmail} has access to main folder ${folderId}`);
      return true;
    }

    // If no main access, check if user has access to any shortcut folders
    const shortcutTargets = await getShortcutFolders(folderId);
    
    for (const targetFolderId of shortcutTargets) {
      try {
        const targetPermissions = await drive.permissions.list({
          fileId: targetFolderId,
          fields: 'permissions(emailAddress, type, role)',
          supportsAllDrives: true,
        });

        const hasShortcutAccess = targetPermissions.data.permissions?.some(
          (perm) => perm.emailAddress === userEmail && perm.type === 'user'
        ) ?? false;

        if (hasShortcutAccess) {
          console.log(`User ${userEmail} has access to shortcut folder ${targetFolderId}`);
          return true;
        }
      } catch (error) {
        console.error(`Error checking access to shortcut folder ${targetFolderId}:`, error);
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}

/**
 * Create a test folder in Google Drive (for development purposes)
 */
export async function createTestFolder(folderName: string): Promise<string | null> {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name, webViewLink',
      supportsAllDrives: true,
    });

    const folderId = response.data.id;
    
    if (folderId) {
      console.log(`Created test folder: ${folderName} with ID: ${folderId}`);
      console.log(`Folder URL: ${response.data.webViewLink}`);
      
      // Make the folder accessible to anyone with the link for testing
      await drive.permissions.create({
        fileId: folderId,
        supportsAllDrives: true,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      
      return folderId;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating test folder:', error);
    return null;
  }
}
