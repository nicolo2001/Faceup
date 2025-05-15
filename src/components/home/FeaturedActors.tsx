import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { Actor } from '../../types';

interface FeaturedActorsProps {
  actors: Actor[];
}

const FeaturedActors: React.FC<FeaturedActorsProps> = ({ actors }) => {
  const navigate = useNavigate();
  
  // Filter to only show featured actors
  const featuredActors = actors.filter(actor => actor.featured);

  const handleViewProfile = (actorId: string) => {
    navigate(`/actor/${actorId}`);
    window.scrollTo(0, 0);
  };

  const handleOrder = (actorId: string) => {
    navigate(`/order/${actorId}`);
    window.scrollTo(0, 0);
  };

  const handleViewAll = () => {
    navigate('/search');
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Actors</h2>
          <button 
            onClick={handleViewAll}
            className="flex items-center text-indigo-600 font-medium hover:text-indigo-800"
          >
            View all <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredActors.map((actor) => (
            <Card key={actor.id} hoverable className="h-full">
              <CardBody className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Avatar 
                        src={actor.avatarUrl} 
                        alt={actor.name} 
                        size="lg" 
                        status="online"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {actor.name}
                          </h3>
                          {actor.verified && (
                            <CheckCircle className="h-4 w-4 ml-1 text-blue-500" />
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {actor.videoTypes.slice(0, 2).join(', ')}
                          {actor.videoTypes.length > 2 && ', ...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Rating value={actor.rating} showValue size="sm" />
                      <span className="text-xs text-gray-500 ml-1">({actor.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {actor.tagline}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {actor.languages.slice(0, 2).map((language) => (
                      <Badge key={language} variant="outline" size="sm">
                        {language}
                      </Badge>
                    ))}
                    {actor.tones.slice(0, 2).map((tone) => (
                      <Badge key={tone} variant="primary" size="sm">
                        {tone}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500 text-sm">Starting at</span>
                      <p className="text-gray-900 font-semibold">${actor.basePrice}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewProfile(actor.id)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleOrder(actor.id)}
                      >
                        Order
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedActors;