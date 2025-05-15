import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { PortfolioItem } from '../../types';
import Badge from '../ui/Badge';

interface PortfolioSectionProps {
  portfolioItems: PortfolioItem[];
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolioItems }) => {
  const [activeVideo, setActiveVideo] = useState<PortfolioItem | null>(null);
  
  if (portfolioItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">This actor hasn't added any portfolio items yet.</p>
      </div>
    );
  }

  const closeModal = () => {
    setActiveVideo(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portfolioItems.map((item) => (
          <div 
            key={item.id}
            className="group relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setActiveVideo(item)}
          >
            <div className="aspect-video w-full bg-gray-200 overflow-hidden">
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
              <div className="p-1.5 bg-indigo-600 rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-medium mb-1 line-clamp-1">{item.title}</h3>
              <div className="flex space-x-2">
                <Badge variant="primary" size="sm">{item.videoType}</Badge>
                <Badge variant="outline" size="sm" className="bg-black/30 border-white/20">{item.tone}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">{activeVideo.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              <div className="aspect-video w-full bg-black mb-4">
                {/* For demo purposes, we'll just show the thumbnail instead of an actual video */}
                <img 
                  src={activeVideo.thumbnailUrl} 
                  alt={activeVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="primary">{activeVideo.videoType}</Badge>
                <Badge variant="outline">{activeVideo.language}</Badge>
                <Badge variant="success">{activeVideo.tone}</Badge>
              </div>
              
              <p className="text-gray-700 mb-4">{activeVideo.description}</p>
              
              <div className="text-sm text-gray-500">
                Added on {new Date(activeVideo.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;