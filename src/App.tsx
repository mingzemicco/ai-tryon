import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGenerator from './pages/ImageGenerator';

function ErrorFallback() {
  return (
    <div className="p-4 text-red-600">
      Something went wrong. Please check the console.
    </div>
  );
}

export default function App() {
  console.log('App component rendering');
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<ImageGenerator />} />
          <Route path="/generate" element={<ImageGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}
