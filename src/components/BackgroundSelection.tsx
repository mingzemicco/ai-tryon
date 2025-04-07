
import React from 'react';

const BACKGROUNDS = [
  { id: 'white', name: 'White' },
  { id: 'black', name: 'Black' },
  { id: 'gray', name: 'Gray' },
  { id: 'beach', name: 'Beach' },
  { id: 'city', name: 'City' },
  { id: 'studio', name: 'Studio' }
];

export default function BackgroundSelection({ onSelect }: { onSelect: (background: string) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Select Background</h3>
      <div className="space-y-2">
        {BACKGROUNDS.map((bg) => (
          <label key={bg.id} className="flex items-center space-x-2">
            <input
              type="radio"
              name="background"
              value={bg.id}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span>{bg.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
