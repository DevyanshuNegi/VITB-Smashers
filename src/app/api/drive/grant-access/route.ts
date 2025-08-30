import { type NextRequest, NextResponse } from 'next/server';
import { grantFolderAccess } from '~/lib/google-drive';
import { z } from 'zod';
import { auth } from '~/server/auth';

const grantAccessSchema = z.object({
  folderId: z.string(),
  userEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const { folderId, userEmail } = grantAccessSchema.parse(body);

    // Grant access to the folder
    const success = await grantFolderAccess(folderId, userEmail);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Access granted successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to grant access',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error granting folder access:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to grant access'
      },
      { status: 500 }
    );
  }
}
