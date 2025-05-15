import React from 'react';
import { Clock, Star, Video, ThumbsUp } from 'lucide-react';

interface ProfileStatsProps {
  completedOrders: number;
  averageResponseTime: string;
  rating: number;
  reviewCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  completedOrders,
  averageResponseTime,
  rating,
  reviewCount
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Video className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
        <p className="text-sm text-gray-600">Completed Orders</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{averageResponseTime}</p>
        <p className="text-sm text-gray-600">Avg. Response Time</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Star className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{rating.toFixed(1)}</p>
        <p className="text-sm text-gray-600">Rating</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <ThumbsUp className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
        <p className="text-sm text-gray-600">Reviews</p>
      </div>
    </div>
  );
};

export default ProfileStats;