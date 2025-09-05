import { type NextRequest, NextResponse } from 'next/server';
import { getFolderContents } from '~/lib/google-drive';
import { z } from 'zod';
import { auth } from '~/server/auth';

const folderContentsSchema = z.object({
  folderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          message: 'You must be signed in to access folder contents. Please sign in and try again.'
        },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const { folderId } = folderContentsSchema.parse(body);

    // Get folder contents
    const files = await getFolderContents(folderId);

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch folder contents'
      },
      { status: 500 }
    );
  }
}
