import React, { useCallback, useState } from 'react';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      // Clean up previous preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      onUpload(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  }, [onUpload]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="h-32 w-32 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-600">Upload Clothing Image</span>
        )}
      </div>
      </label>
    </div>
  );
}
