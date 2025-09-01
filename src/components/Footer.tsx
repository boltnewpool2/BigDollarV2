import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center">
            Imagined, Designed and Developed by 
            <span className="font-semibold text-gray-900 ml-1 mr-1">Abhishekh Dey</span>
            <Heart className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};