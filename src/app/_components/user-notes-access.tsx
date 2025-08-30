"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink: string;
    webContentLink?: string;
    size?: string;
}

interface UserNotesAccessProps {
    productId: string;
    productName: string;
    googleDriveFolderId?: string;
}

export function UserNotesAccess({
    productId,
    productName,
    googleDriveFolderId
}: UserNotesAccessProps) {
    const [folderContents, setFolderContents] = useState<DriveFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: hasPurchased } = api.product.hasPurchased.useQuery({
        productId
    });

    const fetchFolderContents = async () => {
        if (!googleDriveFolderId || !hasPurchased) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/drive/folder-contents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderId: googleDriveFolderId }),
            });

            const data = await response.json() as {
                success: boolean;
                files?: DriveFile[];
                error?: string;
            };

            if (data.success && data.files) {
                setFolderContents(data.files);
            } else {
                setError(data.error ?? 'Failed to fetch folder contents');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch folder contents');
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasPurchased) {
        return (
            <div className="rounded-lg border border-gray-200 p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold">Access Your Notes</h3>
                <p className="text-gray-600">
                    Purchase this product to access the study materials.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-green-800">
                📚 Your Purchased Notes: {productName}
            </h3>

            {googleDriveFolderId ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchFolderContents}
                            disabled={isLoading}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : 'View Files'}
                        </button>

                        <a
                            href={`https://drive.google.com/drive/folders/${googleDriveFolderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            📁 Open in Google Drive
                        </a>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-red-700">
                            {error}
                        </div>
                    )}

                    {folderContents.length > 0 && (
                        <div className="mt-4">
                            <h4 className="mb-3 font-medium">Files in this folder:</h4>
                            <div className="space-y-2">
                                {folderContents.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between rounded-md border border-gray-200 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">
                                                {file.mimeType.includes('pdf') ? '📄' :
                                                    file.mimeType.includes('image') ? '🖼️' :
                                                        file.mimeType.includes('video') ? '🎥' :
                                                            file.mimeType.includes('folder') ? '📁' : '📄'}
                                            </span>
                                            <div>
                                                <p className="font-medium">{file.name}</p>
                                                {file.size && (
                                                    <p className="text-sm text-gray-500">
                                                        {formatFileSize(parseInt(file.size))}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={file.webViewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                            >
                                                View
                                            </a>
                                            {file.webContentLink && (
                                                <a
                                                    href={file.webContentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                                                >
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-md bg-yellow-50 p-3 text-yellow-700">
                    <p>📧 Access details have been sent to your email.</p>
                    <p className="text-sm">Please check your inbox for Google Drive access notification.</p>
                </div>
            )}
        </div>
    );
}

function formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
