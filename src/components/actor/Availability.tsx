import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface AvailabilityProps {
  nextAvailable: string;
  workingHours: string;
  timezone: string;
}

const Availability: React.FC<AvailabilityProps> = ({
  nextAvailable,
  workingHours,
  timezone
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Next Available</p>
            <p className="text-gray-600">{nextAvailable}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Working Hours</p>
            <p className="text-gray-600">{workingHours}</p>
            <p className="text-sm text-gray-500 mt-1">Timezone: {timezone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;