import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { Buffer } from 'node:buffer';

// Vercel automatically parses the body for common content types,
// but for multipart/form-data, we might need to handle the stream or rely on Vercel's built-in helpers if available.
// For simplicity, let's assume Vercel provides the file data in a way we can access.
// Note: Vercel's handling of multipart/form-data might require specific request parsing.
// If this basic approach fails, we might need a library like `busboy` or check Vercel's latest recommendations.

export const config = {
  api: {
    bodyParser: false, // We need to disable the default body parser to handle streams/multipart data correctly
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Method Not Allowed');
  }

  try {
    // Vercel Request object might contain the file stream or buffer directly
    // Accessing the file requires understanding how Vercel populates `request` for multipart/form-data
    // Let's assume the file content is accessible via request stream or a specific property.
    // This part is highly dependent on how Vercel handles file uploads in Serverless Functions
    // and might need adjustment based on testing or Vercel documentation.

    // A common pattern involves reading the raw body stream
    const chunks: Buffer[] = [];
    for await (const chunk of request) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Extract filename - this is tricky without a parser like multer.
    // We might need to rely on headers or query parameters passed from the client.
    // Let's assume the client sends the filename in a header 'x-vercel-filename' for this example.
    const filename = request.headers['x-vercel-filename'] as string | undefined;

    if (!filename) {
      return response.status(400).json({ error: 'Filename missing. Ensure x-vercel-filename header is set.' });
    }

     if (!fileBuffer || fileBuffer.length === 0) {
       return response.status(400).json({ error: 'No file content received.' });
     }

    // Ensure the Vercel Blob Read/Write token is set in environment variables
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable is not set.');
      return response.status(500).json({ error: 'Server configuration error.' });
    }

    // Upload the file buffer to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public', // Make the blob publicly accessible
      // Add cache control headers if needed
      // cacheControlMaxAge: 31536000, // Example: 1 year
    });

    // Return the URL of the uploaded file
    return response.status(200).json({ url: blob.url });

  } catch (error: any) {
    console.error('Upload failed:', error);
    // Provide more specific error messages if possible
    let errorMessage = 'Upload failed due to an internal error.';
    if (error.message) {
        errorMessage = `Upload failed: ${error.message}`;
    }
    return response.status(500).json({ error: errorMessage });
  }
}
