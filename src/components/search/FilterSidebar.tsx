import React, { useState, useEffect } from 'react';
import { X, Filter, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';
import { FilterOptions } from '../../types';
import { languageOptions, videoTypeOptions, toneOptions } from '../../data/mockData';
import Badge from '../ui/Badge';

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  onFilterChange,
  onReset,
  isMobile = false,
  onCloseMobile
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions);
  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    videoTypes: true,
    tones: true,
    price: true,
    deliveryTime: true
  });
  
  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filterOptions);
  }, [filterOptions]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleLanguageChange = (language: string) => {
    const updatedLanguages = localFilters.languages?.includes(language)
      ? localFilters.languages.filter(lang => lang !== language)
      : [...(localFilters.languages || []), language];
    
    setLocalFilters({
      ...localFilters,
      languages: updatedLanguages
    });
  };

  const handleVideoTypeChange = (videoType: string) => {
    const updatedVideoTypes = localFilters.videoTypes?.includes(videoType)
      ? localFilters.videoTypes.filter(type => type !== videoType)
      : [...(localFilters.videoTypes || []), videoType];
    
    setLocalFilters({
      ...localFilters,
      videoTypes: updatedVideoTypes
    });
  };

  const handleToneChange = (tone: string) => {
    const updatedTones = localFilters.tones?.includes(tone)
      ? localFilters.tones.filter(t => t !== tone)
      : [...(localFilters.tones || []), tone];
    
    setLocalFilters({
      ...localFilters,
      tones: updatedTones
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalFilters({
      ...localFilters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    });
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setLocalFilters({
      ...localFilters,
      maxDeliveryTime: value
    });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    if (onCloseMobile && isMobile) {
      onCloseMobile();
    }
  };

  const resetFilters = () => {
    setLocalFilters({});
    onReset();
    if (onCloseMobile && isMobile) {
      onCloseMobile();
    }
  };

  const countActiveFilters = () => {
    let count = 0;
    if (localFilters.languages?.length) count += localFilters.languages.length;
    if (localFilters.videoTypes?.length) count += localFilters.videoTypes.length;
    if (localFilters.tones?.length) count += localFilters.tones.length;
    if (localFilters.minPrice !== undefined) count += 1;
    if (localFilters.maxPrice !== undefined) count += 1;
    if (localFilters.maxDeliveryTime !== undefined) count += 1;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Filter className="mr-2 h-5 w-5 text-indigo-600" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm" className="ml-2">{activeFilterCount}</Badge>
          )}
        </h2>
        {isMobile && (
          <button onClick={onCloseMobile} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
        {/* Languages Filter */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left mb-3"
            onClick={() => toggleSection('languages')}
          >
            <h3 className="text-sm font-medium text-gray-900">Languages</h3>
            {expandedSections.languages ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.languages && (
            <div className="space-y-2">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center">
                  <button
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                      localFilters.languages?.includes(language) 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleLanguageChange(language)}
                  >
                    <span>{language}</span>
                    {localFilters.languages?.includes(language) && (
                      <Check className="h-4 w-4 text-indigo-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Types Filter */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left mb-3"
            onClick={() => toggleSection('videoTypes')}
          >
            <h3 className="text-sm font-medium text-gray-900">Video Types</h3>
            {expandedSections.videoTypes ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.videoTypes && (
            <div className="space-y-2">
              {videoTypeOptions.slice(0, 8).map((videoType) => (
                <div key={videoType} className="flex items-center">
                  <button
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                      localFilters.videoTypes?.includes(videoType) 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleVideoTypeChange(videoType)}
                  >
                    <span>{videoType}</span>
                    {localFilters.videoTypes?.includes(videoType) && (
                      <Check className="h-4 w-4 text-indigo-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tones Filter */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left mb-3"
            onClick={() => toggleSection('tones')}
          >
            <h3 className="text-sm font-medium text-gray-900">Tones</h3>
            {expandedSections.tones ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.tones && (
            <div className="space-y-2">
              {toneOptions.map((tone) => (
                <div key={tone} className="flex items-center">
                  <button
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                      localFilters.tones?.includes(tone) 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleToneChange(tone)}
                  >
                    <span>{tone}</span>
                    {localFilters.tones?.includes(tone) && (
                      <Check className="h-4 w-4 text-indigo-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <button 
            className="flex justify-between items-center w-full text-left mb-3"
            onClick={() => toggleSection('price')}
          >
            <h3 className="text-sm font-medium text-gray-900">Price Range ($)</h3>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 text-sm"
                value={localFilters.minPrice || ''}
                onChange={(e) => handlePriceChange(e, 'min')}
                min={0}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 text-sm"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handlePriceChange(e, 'max')}
                min={0}
              />
            </div>
          )}
        </div>

        {/* Delivery Time Filter */}
        <div className="mb-8">
          <button 
            className="flex justify-between items-center w-full text-left mb-3"
            onClick={() => toggleSection('deliveryTime')}
          >
            <h3 className="text-sm font-medium text-gray-900">Max Delivery Time (days)</h3>
            {expandedSections.deliveryTime ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.deliveryTime && (
            <div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={localFilters.maxDeliveryTime || 10}
                onChange={handleDeliveryTimeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 day</span>
                <span>{localFilters.maxDeliveryTime || 10} days</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button variant="primary" fullWidth onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;