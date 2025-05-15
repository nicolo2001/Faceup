import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Languages, Globe, FileText, Heart, Share2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import PortfolioSection from '../components/actor/PortfolioSection';
import ReviewsSection from '../components/actor/ReviewsSection';
import ProfileStats from '../components/actor/ProfileStats';
import ServicePackages from '../components/actor/ServicePackages';
import Availability from '../components/actor/Availability';
import { actors, portfolioItems, reviews } from '../data/mockData';
import { supabase } from '../lib/supabase';

const ActorProfile: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about' | 'reviews'>('portfolio');
  
  // Find the actor or show not found
  const actor = actors.find(a => a.id === actorId);
  
  if (!actor) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Actor Not Found</h1>
          <p className="mb-6">The actor you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/search">Browse Actors</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Filter portfolio items for this actor
  const actorPortfolio = portfolioItems.filter(item => item.actorId === actor.id);
  
  // Filter reviews for this actor
  const actorReviews = reviews.filter(review => review.actorId === actor.id);

  const handlePackageSelect = (packageName: string) => {
    navigate(`/order/${actor.id}?package=${packageName}`);
  };

  const handleHireClick = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { 
        state: { 
          returnTo: `/actor/${actorId}`,
          action: 'hire'
        }
      });
      return;
    }

    // If logged in, navigate to order page
    navigate(`/order/${actor.id}`);
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar
                src={actor.avatarUrl}
                alt={actor.name}
                size="xl"
                status={actor.featured ? "online" : undefined}
                className="mx-auto md:mx-0"
              />
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{actor.name}</h1>
                  {actor.verified && (
                    <span className="flex items-center text-blue-500">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{actor.tagline}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Rating value={actor.rating} showValue size="sm" />
                    <span className="text-sm text-gray-500 ml-1">({actor.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {actor.standardDeliveryTime} day{actor.standardDeliveryTime !== 1 ? 's' : ''} delivery
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Languages className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {actor.languages.join(', ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {actor.videoTypes.map(videoType => (
                    <Badge key={videoType} variant="primary" size="sm">
                      {videoType}
                    </Badge>
                  ))}
                  {actor.tones.map(tone => (
                    <Badge key={tone} variant="outline" size="sm">
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col gap-3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center mb-3">
                  <p className="text-gray-500 text-sm mb-1">Starting at</p>
                  <p className="text-2xl font-bold text-gray-900">${actor.basePrice}</p>
                </div>
                
                <Button
                  fullWidth
                  onClick={handleHireClick}
                >
                  Hire Me
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    fullWidth
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  
                  <Button
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="container mx-auto px-4 py-6">
          <ProfileStats
            completedOrders={actor.completedOrders}
            averageResponseTime={actor.averageResponseTime}
            rating={actor.rating}
            reviewCount={actor.reviewCount}
          />
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'portfolio' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button>
              
              <button
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'about' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              
              <button
                className={`px-4 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${
                  activeTab === 'reviews' 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({actor.reviewCount})
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'portfolio' && <PortfolioSection portfolioItems={actorPortfolio} />}
              
              {activeTab === 'about' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">About Me</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <p className="text-gray-700 mb-6">{actor.bio}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
                          <ul className="space-y-1">
                            {actor.languages.map(language => (
                              <li key={language} className="flex items-center text-gray-700">
                                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                {language}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Video Types</h3>
                          <div className="flex flex-wrap gap-2">
                            {actor.videoTypes.map(videoType => (
                              <Badge key={videoType} variant="primary" size="sm">
                                {videoType}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Packages</h2>
                    <ServicePackages
                      packages={actor.packages}
                      onSelect={handlePackageSelect}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>
                    <Availability
                      nextAvailable={actor.nextAvailable}
                      workingHours={actor.workingHours}
                      timezone={actor.timezone}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <ReviewsSection 
                  reviews={actorReviews} 
                  actorRating={actor.rating} 
                  reviewCount={actor.reviewCount} 
                />
              )}
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-32">
                <h3 className="font-medium text-gray-900 mb-4">Quick Order</h3>
                
                <div className="space-y-4 mb-6">
                  {actor.packages.map((pkg) => (
                    <div key={pkg.name} className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-gray-500">
                          {pkg.deliveryTime} day{pkg.deliveryTime !== 1 ? 's' : ''} delivery
                        </p>
                      </div>
                      <p className="font-semibold">${pkg.price}</p>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-lg bg-indigo-50 p-4 mb-6">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium text-indigo-900">Full Script Required</p>
                      <p className="text-sm text-indigo-700">
                        Please provide a complete script when ordering
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  fullWidth
                  onClick={handleHireClick}
                >
                  Start Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ActorProfile;