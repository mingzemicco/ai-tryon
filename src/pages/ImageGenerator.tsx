import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ModelSelection from '../components/ModelSelection';
import BackgroundSelection from '../components/BackgroundSelection';
import { generateImage } from '../services/geminiService';

export default function ImageGenerator() {
  const [clothingImageUrl, setClothingImageUrl] = useState<string | null>(null);
  const [modelGender, setModelGender] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!clothingImageUrl || !modelGender || !selectedBackground) {
      alert('Please complete all selections');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Calling Gemini API with:', {
        clothingImageUrl,
        modelGender,
        background: selectedBackground
      });
      const result = await generateImage({
        clothingImageUrl: clothingImageUrl,
        modelGender: modelGender,
        background: selectedBackground
      });
      console.log('Received generated images:', result.images);
      setGeneratedImages(result.images);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Image generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder state for new options inspired by screenshots
  const [prompt, setPrompt] = useState('');
  const [poseFreedom, setPoseFreedom] = useState(50);
  const [skinDetail, setSkinDetail] = useState('original'); // 'original' | 'textured'
  const [composition, setComposition] = useState('scene'); // 'scene' | 'original'
  const [numImages, setNumImages] = useState(1); // 1 | 2 | 4 | 8 | 12 | 16

  // State for modal preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Function to open the preview modal
  const handleOpenPreview = (url: string) => {
    setPreviewImageUrl(url);
    setIsPreviewOpen(true);
  };

  // Function to close the preview modal
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImageUrl(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Added pb-24 to prevent action bar from overlapping last content */}
      <div className="max-w-4xl mx-auto pb-24 relative"> 
        {/* Section 1: Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload Clothing Image</h2>
          <ImageUpload onUpload={setClothingImageUrl} currentImage={clothingImageUrl} />
        </div>

        {/* Section 2: Model Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Select AI Model</h2>
          {/* TODO: Add search bar like in screenshot */}
          <ModelSelection onSelect={setModelGender} selectedGender={modelGender} />
        </div>

        {/* Section 3: Configuration Options (Inspired by Screenshot 2) */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Configure Generation</h2>
          
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Describe the desired scene (optional)
            </label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 'Model walking on a sunny beach', 'Studio shot with neutral background'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {/* TODO: Add "Smart Fill" and "History" buttons */}
          </div>

          {/* Background Selection (Moved here) */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
             <BackgroundSelection onSelect={setSelectedBackground} selectedBackground={selectedBackground} />
          </div>

          {/* Pose Freedom Slider */}
          <div>
            <label htmlFor="poseFreedom" className="block text-sm font-medium text-gray-700 mb-1">
              Model Pose AI Freedom ({poseFreedom}%)
            </label>
            <input
              type="range"
              id="poseFreedom"
              min="0"
              max="100"
              value={poseFreedom}
              onChange={(e) => setPoseFreedom(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
             {/* TODO: Add "New" tag */}
          </div>

          {/* Skin Details */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Skin Details</label>
             <div className="flex space-x-2">
               {['original', 'textured'].map((detail) => (
                 <button
                   key={detail}
                   onClick={() => setSkinDetail(detail)}
                   className={`px-4 py-1 rounded-md text-sm border ${
                     skinDetail === detail
                       ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                       : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                   }`}
                 >
                   {detail.charAt(0).toUpperCase() + detail.slice(1)}
                   {/* TODO: Add "限免" (Limited Free) tag */}
                 </button>
               ))}
             </div>
             {/* TODO: Add info tooltip */}
          </div>
          
          {/* Composition */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Composition</label>
             <div className="flex space-x-2">
               {['scene', 'original'].map((comp) => (
                 <button
                   key={comp}
                   onClick={() => setComposition(comp)}
                   className={`px-4 py-1 rounded-md text-sm border ${
                     composition === comp
                       ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                       : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                   }`}
                 >
                   {comp === 'scene' ? 'Reference Scene' : 'Reference Original Image'}
                 </button>
               ))}
             </div>
              {/* TODO: Add info tooltip */}
           </div>

          {/* Number of Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Images to Generate</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 4, 8, 12, 16].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumImages(num)}
                  className={`px-4 py-1 rounded-md text-sm border ${
                    numImages === num
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Action Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm sticky bottom-0 border-t border-gray-200 flex items-center justify-end space-x-4">
           {/* TODO: Add cost indicator */}
           <span className="text-sm text-gray-500">Estimated cost: 10 points</span> 
           <button
             onClick={handleGenerate}
             disabled={isLoading || !clothingImageUrl || !modelGender || !selectedBackground}
             className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
           >
             {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             ) : null}
             {isLoading ? 'Generating...' : 'Generate'}
           </button>
        </div>

        {/* Section 5: Generated Images */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((imgUrl, index) => {
                // Function to handle download
                const handleDownload = (url: string, filename: string) => {
                  const link = document.createElement('a');
                  link.href = url;
                  // Suggest a filename (optional, browser might override)
                  // Fetching as blob might be needed for cross-origin images if served differently
                  link.download = filename || `generated-image-${index + 1}.png`; 
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                };

                // Use the new function to open the modal
                const handlePreview = (url: string) => {
                  handleOpenPreview(url);
                  // Fullscreen API example remains commented out
                  /* 
                  const imgElement = document.getElementById(`generated-img-${index}`);
                  if (imgElement && imgElement.requestFullscreen) {
                    imgElement.requestFullscreen().catch(err => {
                      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                    });
                  } 
                  */
                };

                return (
                  <div key={index} className="relative group bg-white rounded-lg shadow-sm overflow-hidden">
                    <img 
                      id={`generated-img-${index}`} // Add ID for potential fullscreen targeting
                      src={imgUrl} 
                      alt={`Generated ${index + 1}`} 
                      className="w-full h-auto object-contain" // Changed object-cover to object-contain, removed aspect-square from parent
                      loading="lazy"
                    />
                    {/* Overlay Buttons */}
                    <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(imgUrl, `generated-${index + 1}.png`)}
                        title="Download Image"
                        className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {/* Preview Button */}
                      <button
                        onClick={() => handlePreview(imgUrl)}
                        title="Preview Fullscreen"
                        className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal for Image Preview */}
        {isPreviewOpen && previewImageUrl && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={handleClosePreview} // Close modal when clicking backdrop
          >
            <div 
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
              {/* Close Button */}
              <button
                onClick={handleClosePreview}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image */}
              <img 
                src={previewImageUrl} 
                alt="Preview" 
                className="block max-w-full max-h-[90vh] object-contain" 
              />
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
