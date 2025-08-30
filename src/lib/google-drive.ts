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
 * Grant access to a Google Drive folder for a specific user
 */
export async function grantFolderAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'user',
        emailAddress: userEmail,
      },
      sendNotificationEmail: true,
      emailMessage: 'You now have access to your purchased notes from NotesHub!',
    });
    
    return true;
  } catch (error) {
    console.error('Error granting folder access:', error);
    return false;
  }
}

/**
 * Get folder contents (files and subfolders)
 */
export async function getFolderContents(folderId: string): Promise<DriveFile[]> {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, webViewLink, webContentLink, size)',
      orderBy: 'name',
    });

    return response.data.files?.map(file => ({
      id: file.id!,
      name: file.name!,
      mimeType: file.mimeType!,
      webViewLink: file.webViewLink!,
      webContentLink: file.webContentLink ?? undefined,
      size: file.size ?? undefined,
    })) ?? [];
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
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the folder details to return the webViewLink
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'webViewLink',
    });

    return response.data.webViewLink ?? '';
  } catch (error) {
    console.error('Error creating shareable link:', error);
    throw new Error('Failed to create shareable link');
  }
}

/**
 * Revoke access to a folder for a specific user
 */
export async function revokeFolderAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    // First, get all permissions for the folder
    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id, emailAddress, type)',
    });

    // Find the permission for the specific user
    const userPermission = permissions.data.permissions?.find(
      (perm) => perm.emailAddress === userEmail && perm.type === 'user'
    );

    if (userPermission?.id) {
      await drive.permissions.delete({
        fileId: folderId,
        permissionId: userPermission.id,
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error revoking folder access:', error);
    return false;
  }
}

/**
 * Check if a user has access to a folder
 */
export async function checkUserAccess(
  folderId: string,
  userEmail: string
): Promise<boolean> {
  try {
    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(emailAddress, type, role)',
    });

    return permissions.data.permissions?.some(
      (perm) => perm.emailAddress === userEmail && perm.type === 'user'
    ) ?? false;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}
