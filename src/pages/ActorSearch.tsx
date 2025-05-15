import React, { useState, useEffect, useRef } from 'react';
import { Sliders, X, ArrowUp, ArrowDown, BarChart2, Grid, List, Check } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import FilterSidebar from '../components/search/FilterSidebar';
import SearchBar from '../components/search/SearchBar';
import ActorCard from '../components/search/ActorCard';
import Button from '../components/ui/Button';
import { actors } from '../data/mockData';
import { Actor, FilterOptions } from '../types';
import Badge from '../components/ui/Badge';

const ActorSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [filteredActors, setFilteredActors] = useState<Actor[]>(actors);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const compareModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterOptions, sortOption]);

  // Close compare modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (compareModalRef.current && !compareModalRef.current.contains(event.target as Node)) {
        setIsCompareModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsLoading(true);
    // Simulate loading state for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      let results = [...actors];

      // Apply search filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        results = results.filter(
          actor =>
            actor.name.toLowerCase().includes(lowerSearchTerm) ||
            actor.tagline.toLowerCase().includes(lowerSearchTerm) ||
            actor.videoTypes.some(type => type.toLowerCase().includes(lowerSearchTerm)) ||
            actor.tones.some(tone => tone.toLowerCase().includes(lowerSearchTerm)) ||
            actor.languages.some(lang => lang.toLowerCase().includes(lowerSearchTerm))
        );
      }

      // Apply languages filter
      if (filterOptions.languages && filterOptions.languages.length > 0) {
        results = results.filter(actor =>
          filterOptions.languages!.some(language => actor.languages.includes(language))
        );
      }

      // Apply video types filter
      if (filterOptions.videoTypes && filterOptions.videoTypes.length > 0) {
        results = results.filter(actor =>
          filterOptions.videoTypes!.some(videoType => actor.videoTypes.includes(videoType))
        );
      }

      // Apply tones filter
      if (filterOptions.tones && filterOptions.tones.length > 0) {
        results = results.filter(actor =>
          filterOptions.tones!.some(tone => actor.tones.includes(tone))
        );
      }

      // Apply price range filter
      if (filterOptions.minPrice !== undefined) {
        results = results.filter(actor => actor.basePrice >= filterOptions.minPrice!);
      }
      if (filterOptions.maxPrice !== undefined) {
        results = results.filter(actor => actor.basePrice <= filterOptions.maxPrice!);
      }

      // Apply delivery time filter
      if (filterOptions.maxDeliveryTime !== undefined) {
        results = results.filter(actor => actor.standardDeliveryTime <= filterOptions.maxDeliveryTime!);
      }

      // Apply sorting
      switch (sortOption) {
        case 'price-low':
          results.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case 'price-high':
          results.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'delivery-time':
          results.sort((a, b) => a.standardDeliveryTime - b.standardDeliveryTime);
          break;
        case 'relevance':
        default:
          // Keep original order or implement relevance algorithm
          break;
      }

      setFilteredActors(results);
      setIsLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilterOptions({});
    setSearchTerm('');
    setFilteredActors(actors);
    setSortOption('relevance');
  };

  const toggleActorSelection = (actorId: string) => {
    if (selectedActors.includes(actorId)) {
      setSelectedActors(selectedActors.filter(id => id !== actorId));
    } else {
      if (selectedActors.length < 3) {
        setSelectedActors([...selectedActors, actorId]);
      }
    }
  };

  const openCompareModal = () => {
    if (selectedActors.length > 1) {
      setIsCompareModalOpen(true);
    }
  };

  const removeFilter = (type: string, value: string) => {
    if (type === 'language') {
      setFilterOptions({
        ...filterOptions,
        languages: filterOptions.languages?.filter(lang => lang !== value)
      });
    } else if (type === 'videoType') {
      setFilterOptions({
        ...filterOptions,
        videoTypes: filterOptions.videoTypes?.filter(vt => vt !== value)
      });
    } else if (type === 'tone') {
      setFilterOptions({
        ...filterOptions,
        tones: filterOptions.tones?.filter(t => t !== value)
      });
    } else if (type === 'minPrice') {
      const { minPrice, ...rest } = filterOptions;
      setFilterOptions(rest);
    } else if (type === 'maxPrice') {
      const { maxPrice, ...rest } = filterOptions;
      setFilterOptions(rest);
    } else if (type === 'maxDeliveryTime') {
      const { maxDeliveryTime, ...rest } = filterOptions;
      setFilterOptions(rest);
    }
  };

  const selectedActorsData = actors.filter(actor => selectedActors.includes(actor.id));

  return (
    <MainLayout>
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find the Perfect Actor</h1>
            <p className="text-gray-600 text-lg">
              Browse our talented pool of professional video actors
            </p>
          </div>

          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              onToggleFilters={toggleMobileFilters} 
              initialSearchTerm={searchTerm}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
              <FilterSidebar
                filterOptions={filterOptions}
                onFilterChange={setFilterOptions}
                onReset={resetFilters}
              />
            </aside>

            {/* Mobile Filters Modal */}
            {isMobileFiltersOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto md:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileFilters}></div>
                <div className="relative bg-white mx-4 my-6 rounded-lg max-w-sm mx-auto">
                  <FilterSidebar
                    filterOptions={filterOptions}
                    onFilterChange={setFilterOptions}
                    onReset={resetFilters}
                    isMobile={true}
                    onCloseMobile={toggleMobileFilters}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-grow">
              {/* Active Filters */}
              {(filterOptions.languages?.length || 
                filterOptions.videoTypes?.length || 
                filterOptions.tones?.length || 
                filterOptions.minPrice || 
                filterOptions.maxPrice || 
                filterOptions.maxDeliveryTime) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    
                    {filterOptions.languages?.map(language => (
                      <span key={language} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {language}
                        <button 
                          type="button" 
                          onClick={() => removeFilter('language', language)}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}

                    {filterOptions.videoTypes?.map(videoType => (
                      <span key={videoType} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {videoType}
                        <button 
                          type="button" 
                          onClick={() => removeFilter('videoType', videoType)}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}

                    {filterOptions.tones?.map(tone => (
                      <span key={tone} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tone}
                        <button 
                          type="button" 
                          onClick={() => removeFilter('tone', tone)}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}

                    {filterOptions.minPrice !== undefined && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Min: ${filterOptions.minPrice}
                        <button 
                          type="button" 
                          onClick={() => removeFilter('minPrice', '')}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {filterOptions.maxPrice !== undefined && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Max: ${filterOptions.maxPrice}
                        <button 
                          type="button" 
                          onClick={() => removeFilter('maxPrice', '')}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {filterOptions.maxDeliveryTime !== undefined && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Max {filterOptions.maxDeliveryTime} days
                        <button 
                          type="button" 
                          onClick={() => removeFilter('maxDeliveryTime', '')}
                          className="ml-1.5 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto text-indigo-600"
                      onClick={resetFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Header */}
              <div className="mb-4 flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-2 sm:mb-0">
                  {isLoading ? (
                    <p className="text-gray-600">Searching...</p>
                  ) : (
                    <p className="text-gray-600">
                      {filteredActors.length} {filteredActors.length === 1 ? 'actor' : 'actors'} found
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="relevance">Sort by: Relevance</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="delivery-time">Fastest Delivery</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      {sortOption.includes('price') ? (
                        sortOption === 'price-low' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <BarChart2 className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  {/* View mode toggle */}
                  <div className="hidden sm:flex items-center border border-gray-300 rounded-md">
                    <button
                      className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
                      onClick={() => setViewMode('list')}
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="md:hidden">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center"
                      onClick={toggleMobileFilters}
                    >
                      <Sliders className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Compare bar */}
              {selectedActors.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-40">
                  <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium mr-4">
                        {selectedActors.length} {selectedActors.length === 1 ? 'actor' : 'actors'} selected
                      </span>
                      <div className="flex space-x-2">
                        {selectedActorsData.map(actor => (
                          <div key={actor.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <img 
                              src={actor.avatarUrl} 
                              alt={actor.name} 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm">{actor.name}</span>
                            <button 
                              onClick={() => toggleActorSelection(actor.id)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedActors([])}
                      >
                        Clear
                      </Button>
                      <Button 
                        size="sm"
                        onClick={openCompareModal}
                        disabled={selectedActors.length < 2}
                      >
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredActors.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                  : "space-y-4"
                }>
                  {filteredActors.map(actor => (
                    <div key={actor.id} className="relative">
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => toggleActorSelection(actor.id)}
                          className={`p-2 rounded-full ${
                            selectedActors.includes(actor.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                          }`}
                          title={selectedActors.includes(actor.id) ? "Remove from comparison" : "Add to comparison"}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                      <ActorCard actor={actor} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No actors found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters to find more results.
                  </p>
                  <Button onClick={resetFilters}>Reset all filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
              ref={compareModalRef}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Compare Actors
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Feature
                            </th>
                            {selectedActorsData.map(actor => (
                              <th key={actor.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={actor.avatarUrl} 
                                    alt={actor.name} 
                                    className="w-16 h-16 rounded-full mb-2 object-cover"
                                  />
                                  {actor.name}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Rating
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                <div className="flex items-center justify-center">
                                  <span className="text-amber-500">★</span>
                                  <span className="ml-1">{actor.rating.toFixed(1)}</span>
                                  <span className="text-gray-400 ml-1">({actor.reviewCount})</span>
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Starting Price
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                <span className="font-semibold">${actor.basePrice}</span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Delivery Time
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                <span>{actor.standardDeliveryTime} days</span>
                                {actor.expressDeliveryTime && (
                                  <span className="block text-indigo-600">
                                    Express: {actor.expressDeliveryTime} day
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Languages
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {actor.languages.map(lang => (
                                    <Badge key={lang} variant="outline" size="sm">{lang}</Badge>
                                  ))}
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Video Types
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {actor.videoTypes.slice(0, 3).map(type => (
                                    <Badge key={type} variant="primary" size="sm">{type}</Badge>
                                  ))}
                                  {actor.videoTypes.length > 3 && (
                                    <Badge variant="outline" size="sm">+{actor.videoTypes.length - 3}</Badge>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Completed Orders
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                {actor.completedOrders}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Actions
                            </td>
                            {selectedActorsData.map(actor => (
                              <td key={actor.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <div className="flex flex-col space-y-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => window.location.href = `/actor/${actor.id}`}
                                  >
                                    View Profile
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => window.location.href = `/order/${actor.id}`}
                                  >
                                    Order Now
                                  </Button>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button 
                  variant="outline"
                  onClick={() => setIsCompareModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ActorSearch;