import React from 'react';
import { Clock, Check } from 'lucide-react';
import Button from '../ui/Button';

interface Package {
  name: string;
  price: number;
  deliveryTime: number;
  features: string[];
  popular?: boolean;
}

interface ServicePackagesProps {
  packages: Package[];
  onSelect: (packageName: string) => void;
}

const ServicePackages: React.FC<ServicePackagesProps> = ({ packages, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg.name}
          className={`relative bg-white rounded-lg border ${
            pkg.popular ? 'border-indigo-500 shadow-lg' : 'border-gray-200'
          } p-6`}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.name}</h3>
          
          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">${pkg.price}</p>
            <div className="flex items-center text-gray-600 mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {pkg.deliveryTime} day{pkg.deliveryTime !== 1 ? 's' : ''} delivery
              </span>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            variant={pkg.popular ? 'primary' : 'outline'}
            fullWidth
            onClick={() => onSelect(pkg.name)}
          >
            Select Package
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ServicePackages;