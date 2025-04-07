import React, { useCallback, useState, useRef, useEffect } from 'react';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  currentImage: string | null; // Added prop
}

export default function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null); 
  // Use a ref to keep track of the object URL that needs cleanup
  const objectUrlRef = useRef<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Revoke previous URL before creating a new one
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const file = e.target.files?.[0];
    if (!file) {
      setLocalPreviewUrl(null); // Clear state preview if no file selected
      return;
    }

    // Validate file size (max 20MB - matching screenshot text)
    if (file.size > 20 * 1024 * 1024) { 
      alert('Image size must be less than 20MB');
      setLocalPreviewUrl(null); // Clear preview on error
      if (e.target) e.target.value = ''; // Reset file input
      return;
    }

    // Create new object URL
    const newObjectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(newObjectUrl); // Update state for display
    objectUrlRef.current = newObjectUrl; // Store in ref for cleanup

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Removed duplicate declaration above
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        // No specific headers needed here when sending FormData; browser sets Content-Type
        body: formData, // Send FormData object
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const { url } = await response.json();
      onUpload(url); // Update parent state
      // Keep local preview state until parent provides currentImage, 
      // but the ref ensures the object URL can still be cleaned up.

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
      setLocalPreviewUrl(null); // Clear preview state on error
      // Revoke the URL created for the failed attempt
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if (e.target) e.target.value = ''; // Reset file input
    }
  }, [onUpload]);

  // Determine which URL to display: parent's state or local preview
  const displayUrl = currentImage || localPreviewUrl;

  // Effect for cleanup on unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null; // Clear ref on unmount
      }
    };
  }, []); // Empty dependency array ensures this runs only on unmount

  return (
    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition duration-150 ease-in-out">
      <label className="cursor-pointer block">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp" // Be more specific with accepted types
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[150px]"> 
          {displayUrl ? (
            <img 
              src={displayUrl} 
              alt="Clothing preview" 
              className="max-h-40 max-w-full object-contain rounded-md" // Adjusted size
            />
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-purple-700 font-medium">Click to upload, or drag and drop</span>
              <span className="text-sm text-gray-500">Max 9 images, single file up to 20MB, GIF not supported</span>
              {/* TODO: Add drag and drop functionality */}
            </>
          )}
        </div>
      </label>
    </div>
  );
}
