import React from 'react';
import Avatar from '../ui/Avatar';
import Rating from '../ui/Rating';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  actorRating: number;
  reviewCount: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, actorRating, reviewCount }) => {
  // Calculate rating stats
  const starCounts = Array(5).fill(0);
  reviews.forEach(review => {
    const starIndex = Math.floor(review.rating) - 1;
    if (starIndex >= 0 && starIndex < 5) {
      starCounts[starIndex]++;
    }
  });
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="md:border-r md:border-gray-200 md:pr-6 mb-6 md:mb-0">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-gray-900 mb-1">{actorRating.toFixed(1)}</span>
              <Rating value={actorRating} size="md" />
              <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
            </div>
          </div>
          
          <div className="flex-1 md:pl-6">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars - 1];
              const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center mb-2 last:mb-0">
                  <span className="text-sm text-gray-700 w-4 mr-2">{stars}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-2 bg-amber-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar 
                    src={review.creatorAvatarUrl} 
                    alt={review.creatorName} 
                    fallback={review.creatorName.charAt(0)}
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{review.creatorName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Rating value={review.rating} size="sm" />
              </div>
              
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;