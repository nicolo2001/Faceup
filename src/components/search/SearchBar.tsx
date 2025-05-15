import React, { useState, useEffect, useRef } from 'react';
import { Search, Sliders, X, Clock, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import { languageOptions, videoTypeOptions, toneOptions } from '../../data/mockData';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onToggleFilters: () => void;
  initialSearchTerm?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onToggleFilters, 
  initialSearchTerm = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const allOptions = [
      ...languageOptions, 
      ...videoTypeOptions, 
      ...toneOptions,
      'Corporate Spokesperson',
      'Tech Explainer',
      'Product Demonstration',
      'Educational Content',
      'Marketing Video',
      'Training Video',
      'Multilingual Presenter'
    ];

    const filtered = allOptions.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    setSuggestions(filtered);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
    
    // Save to recent searches
    if (searchTerm.trim() !== '') {
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter(s => s !== searchTerm)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    
    // Save to recent searches
    const updatedSearches = [
      suggestion,
      ...recentSearches.filter(s => s !== suggestion)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    setShowSuggestions(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const popularSearches = [
    'Explainer Videos',
    'Product Demos',
    'Corporate',
    'Tutorial',
    'English'
  ];

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search actors by name, skills, video types..."
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Suggestions dropdown */}
          {showSuggestions && (searchTerm.length > 0 || recentSearches.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Recent Searches
                    </h3>
                    <button 
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {recentSearches.map((term, index) => (
                      <li key={`recent-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleRecentSearchClick(term)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center"
                        >
                          <Clock className="h-3 w-3 mr-2 text-gray-400" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Suggestions based on input */}
              {suggestions.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h3>
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={`suggestion-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Popular searches (shown when input is empty) */}
              {searchTerm.length === 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" /> Popular Searches
                  </h3>
                  <ul>
                    {popularSearches.map((term, index) => (
                      <li key={`popular-${index}`}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="whitespace-nowrap">
            Search
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="sm:hidden"
            onClick={onToggleFilters}
          >
            <Sliders className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;