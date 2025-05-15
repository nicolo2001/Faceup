import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MessageSquare } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { Actor } from '../../types';
import { supabase } from '../../lib/supabase';

interface ActorCardProps {
  actor: Actor;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/actor/${actor.id}`);
  };
  
  const handleOrder = () => {
    navigate(`/order/${actor.id}`);
  };

  const handleMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if conversation exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(creator_id.eq.${user.id},actor_id.eq.${actor.id}),and(creator_id.eq.${actor.id},actor_id.eq.${user.id})`)
        .single();

      if (existingConversation) {
        navigate('/messages');
        return;
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          creator_id: user.id,
          actor_id: actor.id
        })
        .select()
        .single();

      if (error) throw error;

      navigate('/messages');
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };
  
  return (
    <Card hoverable className="h-full">
      <CardBody className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Avatar 
                src={actor.avatarUrl} 
                alt={actor.name} 
                size="lg" 
                status={actor.featured ? "online" : undefined}
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

          <p className="text-gray-700 mb-4">
            {actor.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {actor.languages.map((language) => (
              <Badge key={language} variant="outline" size="sm">
                {language}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {actor.tones.map((tone) => (
              <Badge key={tone} variant="primary" size="sm">
                {tone}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Standard Delivery</p>
              <p className="font-medium">{actor.standardDeliveryTime} days</p>
            </div>
            {actor.expressDeliveryTime && (
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-purple-700">Express Delivery</p>
                <p className="font-medium">{actor.expressDeliveryTime} day</p>
              </div>
            )}
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
                onClick={handleMessage}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewProfile}
              >
                View Profile
              </Button>
              <Button 
                size="sm" 
                onClick={handleOrder}
              >
                Order
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActorCard;