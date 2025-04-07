import React from 'react';

export default function ModelSelection({ onSelect }: { onSelect: (gender: string) => void }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Select Model Gender</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="gender"
            value="male"
            onChange={() => onSelect('male')}
            className="h-4 w-4 text-blue-600"
          />
          <span>Male Model</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="gender"
            value="female"
            onChange={() => onSelect('female')}
            className="h-4 w-4 text-blue-600"
          />
          <span>Female Model</span>
        </label>
      </div>
    </div>
  );
}
