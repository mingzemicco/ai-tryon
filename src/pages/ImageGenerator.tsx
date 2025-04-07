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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Fashion Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ImageUpload onUpload={setClothingImageUrl} />
        <ModelSelection onSelect={setModelGender} />
        <BackgroundSelection onSelect={setSelectedBackground} />
      </div>

      {/* Preview Section */}
      {(clothingImageUrl || modelGender || selectedBackground) && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Selections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clothingImageUrl && (
              <div>
                <h3 className="font-medium">Uploaded Image</h3>
                <img src={clothingImageUrl} alt="Uploaded clothing" className="mt-2 rounded-lg w-full h-48 object-cover" />
              </div>
            )}
            {modelGender && (
              <div>
                <h3 className="font-medium">Selected Model</h3>
                <p className="mt-2">{modelGender === 'male' ? 'Male Model' : 'Female Model'}</p>
              </div>
            )}
            {selectedBackground && (
              <div>
                <h3 className="font-medium">Selected Background</h3>
                <p className="mt-2">{selectedBackground}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading || !clothingImageUrl || !modelGender || !selectedBackground}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Images'}
      </button>

      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((img, index) => (
              <img key={index} src={img} alt={`Generated ${index}`} className="rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
