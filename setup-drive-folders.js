import { PrismaClient } from '@prisma/client';
import { createTestFolder } from './src/lib/google-drive.js';

const prisma = new PrismaClient();

async function setupTestFolders() {
  try {
    console.log('🚀 Setting up test folders for NotesHub...');

    // Create a test folder
    const testFolderId = await createTestFolder('NotesHub - Sample Notes Collection');
    
    if (!testFolderId) {
      console.error('❌ Failed to create test folder');
      return;
    }

    console.log(`✅ Created test folder with ID: ${testFolderId}`);
    console.log(`📁 Folder URL: https://drive.google.com/drive/folders/${testFolderId}`);

    // Update all products to use this test folder ID
    const updateResult = await prisma.product.updateMany({
      data: {
        googleDriveFolderId: testFolderId,
      },
    });

    console.log(`✅ Updated ${updateResult.count} products with the new folder ID`);

    // Create a few more specific folders for different types of notes
    const folders = [
      'Engineering Notes - Semester 1',
      'Engineering Notes - Semester 2', 
      'Previous Year Papers',
      'Lab Manuals',
    ];

    for (const folderName of folders) {
      const folderId = await createTestFolder(folderName);
      if (folderId) {
        console.log(`✅ Created folder: ${folderName} (ID: ${folderId})`);
      }
    }

    console.log('🎉 Setup complete! You can now test the Google Drive integration.');
    
  } catch (error) {
    console.error('❌ Error setting up test folders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestFolders();
