
import React from 'react';

// Define the structure for background options, including a visual representation
interface BackgroundOption {
  id: string;
  name: string;
  representation: { type: 'color' | 'image'; value: string }; // Changed 'placeholder' to 'image'
}

const BACKGROUNDS: BackgroundOption[] = [
  { id: 'white', name: 'White', representation: { type: 'color', value: '#FFFFFF' } },
  { id: 'black', name: 'Black', representation: { type: 'color', value: '#000000' } },
  { id: 'gray', name: 'Gray', representation: { type: 'color', value: '#808080' } },
  // Use paths relative to the public directory root
  { id: 'beach', name: 'Beach', representation: { type: 'image', value: '/backgrounds/beach.png' } }, 
  { id: 'city', name: 'City', representation: { type: 'image', value: '/backgrounds/city.png' } }, 
  { id: 'studio', name: 'Studio', representation: { type: 'image', value: '/backgrounds/studio.png' } },
  { id: 'nature', name: 'Nature', representation: { type: 'image', value: '/backgrounds/nature.png' } },
  { id: 'abstract', name: 'Abstract', representation: { type: 'image', value: '/backgrounds/abstract.png' } },
  // --- Added 8 Backgrounds ---
  { id: 'gradient_blue', name: 'Gradient Blue', representation: { type: 'image', value: '/backgrounds/gradient_blue.png' } },
  { id: 'office', name: 'Office', representation: { type: 'image', value: '/backgrounds/office.png' } },
  { id: 'park', name: 'Park', representation: { type: 'image', value: '/backgrounds/park.png' } },
  { id: 'cafe', name: 'Cafe', representation: { type: 'image', value: '/backgrounds/cafe.png' } },
  { id: 'library', name: 'Library', representation: { type: 'image', value: '/backgrounds/library.png' } },
  { id: 'airport', name: 'Airport', representation: { type: 'image', value: '/backgrounds/airport.png' } }, // Changed from Street
  { id: 'mountain', name: 'Mountain', representation: { type: 'image', value: '/backgrounds/mountain.png' } },
  { id: 'sky', name: 'Sky', representation: { type: 'image', value: '/backgrounds/sky.png' } }
];

// Define props interface
interface BackgroundSelectionProps {
  onSelect: (background: string) => void;
  selectedBackground: string | null;
}

export default function BackgroundSelection({ onSelect, selectedBackground }: BackgroundSelectionProps) {

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3"> 
      {BACKGROUNDS.map((bg) => (
        <button
          key={bg.id}
          type="button" // Important: Use type="button" to prevent form submission if wrapped in a form
          onClick={() => onSelect(bg.id)}
          className={`relative block w-full rounded-md border overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
            selectedBackground === bg.id 
              ? 'border-indigo-500 ring-1 ring-indigo-500' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-pressed={selectedBackground === bg.id} // Accessibility
          title={bg.name} // Tooltip
        >
          {/* Visual Representation */}
          {/* Visual Representation */}
          <div className="aspect-square flex items-center justify-center bg-gray-100"> {/* Added bg for loading */}
            {bg.representation.type === 'color' ? (
              <div 
                className="w-full h-full" 
                style={{ backgroundColor: bg.representation.value, border: bg.representation.value === '#FFFFFF' ? '1px solid #eee' : 'none' }} // Add border for white
              ></div>
            ) : ( // Render image if type is 'image'
              <img 
                src={bg.representation.value} 
                alt={bg.name} 
                className="w-full h-full object-cover" // Ensure image covers the area
                loading="lazy" // Lazy load images
              />
            )}
          </div>
          {/* Name Label */}
          <div className="absolute bottom-0 left-0 right-0 text-center bg-black/40 py-0.5">
             <span className="text-white text-xs font-medium truncate px-1">{bg.name}</span>
          </div>

           {/* Hidden Radio Input for form semantics (optional but can be useful) */}
           <input
             type="radio"
             name="background_selection_radio" // Use a different name if needed
             value={bg.id}
             checked={selectedBackground === bg.id}
             onChange={() => onSelect(bg.id)} // Ensure state updates even if JS disabled (though unlikely here)
             className="sr-only" // Hide visually but keep for accessibility/forms
             aria-labelledby={`bg-label-${bg.id}`}
           />
           <span id={`bg-label-${bg.id}`} className="sr-only">{bg.name}</span>

        </button>
      ))}
    </div>
  );
}
