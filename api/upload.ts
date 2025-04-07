import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import formidable from 'formidable'; // Import formidable

// Re-enable bodyParser: false so formidable can parse the stream
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse the form data using formidable
async function parseFormData(req: VercelRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({}); // Initialize formidable
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}


export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Method Not Allowed');
  }

  try {
    // Parse the incoming form data
    const { files } = await parseFormData(request);

    // Access the uploaded file (assuming the client sent it with the key 'file')
    // formidable returns an array even for single file uploads
    const fileArray = files.file;
    const uploadedFile = Array.isArray(fileArray) ? fileArray[0] : undefined;

    if (!uploadedFile) {
      console.error('No file found in parsed form data:', files);
      return response.status(400).json({ error: 'No file uploaded or incorrect field name used.' });
    }

    const filename = uploadedFile.originalFilename || `upload-${Date.now()}`; // Use original name or generate one
    const tempFilePath = uploadedFile.filepath; // formidable uses 'filepath'
    const mimeType = uploadedFile.mimetype; // Get mime type

    // Read the file content from the temporary path
    const fileBuffer = await readFile(tempFilePath);

    if (!fileBuffer || fileBuffer.length === 0) {
      return response.status(400).json({ error: 'File content is empty.' });
    }

    // Ensure the Vercel Blob Read/Write token is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable is not set.');
      return response.status(500).json({ error: 'Server configuration error.' });
    }

    // Upload the file buffer to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: mimeType || undefined, // Pass the mime type if available
    });

    // Return the URL of the uploaded file
    return response.status(200).json({ url: blob.url });

  } catch (error: any) {
    console.error('Upload failed:', error);
    let errorMessage = 'Upload failed due to an internal error.';
    if (error instanceof Error) {
        errorMessage = `Upload failed: ${error.message}`;
    }
    // Add more specific error handling if needed
    if (error.code === 'ENOENT') {
        errorMessage = 'Upload failed: Could not read temporary file.';
    }
    return response.status(500).json({ error: errorMessage });
  }
}
