import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { actors } from '../data/mockData';
import { Actor } from '../types';
import Button from '../components/ui/Button';

const OrderPage: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [actor, setActor] = useState<Actor | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  useEffect(() => {
    // Get the actor data
    const foundActor = actors.find(a => a.id === actorId);
    if (foundActor) {
      setActor(foundActor);
    }

    // Check if a package was pre-selected from the URL
    const queryParams = new URLSearchParams(location.search);
    const packageParam = queryParams.get('package');
    if (packageParam) {
      setSelectedPackage(packageParam);
    } else if (foundActor?.packages?.length > 0) {
      // Default to the first package
      setSelectedPackage(foundActor.packages[0].name);
    }
  }, [actorId, location.search]);

  if (!actor) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Actor Not Found</h1>
          <p className="mb-6">The actor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/search')}>Browse Actors</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Order from {actor.name}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Select a Package</h3>
              <div className="space-y-4">
                {actor.packages.map((pkg) => (
                  <div 
                    key={pkg.name}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.name 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.name)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg">{pkg.name}</h4>
                      <span className="font-bold text-xl">${pkg.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">Delivery in {pkg.deliveryTime} days</p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Your Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Project Title</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., Product Explainer Video"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Project Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                    placeholder="Describe your project in detail..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Upload Script (Required)</label>
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <p className="text-gray-500 mb-2">Drag and drop your script file here, or click to browse</p>
                    <button className="text-indigo-600 font-medium">Browse Files</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Total</h3>
                <p className="text-gray-500">
                  {selectedPackage && actor.packages.find(p => p.name === selectedPackage)?.deliveryTime} days delivery
                </p>
              </div>
              <div className="text-2xl font-bold">
                ${selectedPackage && actor.packages.find(p => p.name === selectedPackage)?.price}
              </div>
            </div>
            
            <Button fullWidth size="lg">
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderPage;