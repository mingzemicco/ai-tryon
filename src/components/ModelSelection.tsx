import React from 'react';

// Import model images
import femaleModel1 from '../assets/images/female-model1.jpeg';
import femaleModel2 from '../assets/images/female-model2.jpeg';
import maleModel1 from '../assets/images/male-model1.png';
import maleModel2 from '../assets/images/male-model2.png';

// Define the props interface
interface ModelSelectionProps {
  onSelect: (gender: string) => void;
  selectedGender: string | null;
}

// Define model data structure
interface Model {
  id: string;
  name: string;
  gender: 'female' | 'male';
  imageSrc: string;
  views?: string; // Placeholder for view count like "17万"
  isNew?: boolean; // Placeholder for "New" tag
}

// Define the available models
const models: Model[] = [
  { id: 'f1', name: 'Xin You', gender: 'female', imageSrc: femaleModel1, views: '2万', isNew: true },
  { id: 'f2', name: 'Qian Ya', gender: 'female', imageSrc: femaleModel2, views: '1万', isNew: true },
  { id: 'm1', name: 'An An', gender: 'male', imageSrc: maleModel1, views: '897', isNew: true }, // Assuming male models also exist in the inspiration
  { id: 'm2', name: 'Placeholder Male', gender: 'male', imageSrc: maleModel2, views: '9808' },
  // Add more models here if needed, potentially including the generic icons from screenshot 1
];

export default function ModelSelection({ onSelect, selectedGender }: ModelSelectionProps) {
  
  // Group models by gender for potential filtering/display logic later
  const femaleModels = models.filter(m => m.gender === 'female');
  const maleModels = models.filter(m => m.gender === 'male');

  // For now, display all models in one grid
  const displayModels = models; 

  return (
    <div className="space-y-4">
       {/* TODO: Add Search bar and potentially filter buttons */}
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
         {/* Removed "Create Your Model" placeholder */}
         {/* Removed "Keep Pose Model" placeholder */}

         {/* Actual Selectable Models */}
         {displayModels.map((model) => (
           <button
             key={model.id}
             onClick={() => onSelect(model.gender)} // Select based on gender for now
             className={`relative block w-full rounded-lg overflow-hidden border-2 focus:outline-none transition duration-150 ease-in-out ${
               selectedGender === model.gender // Highlight based on gender group for now
                 ? 'border-purple-500 ring-2 ring-purple-300' 
                 : 'border-transparent hover:border-gray-300'
             }`}
           >
             <img 
               src={model.imageSrc} 
               alt={model.name} 
               className="w-full h-auto object-cover aspect-square" // Maintain aspect ratio
             />
             {/* Overlay for Name */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-2 pt-4">
               <span className="text-white text-sm font-semibold block truncate">{model.name}</span>
             </div>
             {/* Placeholder for View Count */}
             {model.views && (
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                   <span>{model.views}</span>
                </div>
             )}
             {/* Placeholder for New Tag */}
             {model.isNew && (
               <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                 New
               </span>
             )}
           </button>
         ))}
       </div>
    </div>
  );
}
