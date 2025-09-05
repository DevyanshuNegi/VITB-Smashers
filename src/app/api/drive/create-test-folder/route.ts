import { type NextRequest, NextResponse } from 'next/server';
import { createTestFolder } from '~/lib/google-drive';
import { z } from 'zod';
import { auth } from '~/server/auth';

const createFolderSchema = z.object({
  folderName: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication (you might want to restrict this to admin users)
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          message: 'You must be signed in to create test folders. Please sign in and try again.'
        },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const { folderName } = createFolderSchema.parse(body);

    // Create the test folder
    const folderId = await createTestFolder(folderName);

    if (folderId) {
      return NextResponse.json({
        success: true,
        folderId,
        message: 'Test folder created successfully',
        driveUrl: `https://drive.google.com/drive/folders/${folderId}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create test folder',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating test folder:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create test folder'
      },
      { status: 500 }
    );
  }
}
