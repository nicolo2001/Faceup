import React from 'react';
import { Video, FileText, CheckCircle, Star, MessageSquare, Clock } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';

const HowItWorks: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How FaceUp Works
            </h1>
            <p className="text-xl text-blue-100">
              Get professional videos without appearing on camera yourself. Our platform connects you with talented actors to bring your content to life.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">1</span>
                    <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Actor</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Browse through our diverse pool of professional actors. Filter by language, video type, tone, and more to find the perfect match for your content.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="h-5 w-5 text-amber-400 mt-1 mr-2" />
                      <span className="text-gray-700">View actor portfolios and sample videos</span>
                    </li>
                    <li className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-blue-500 mt-1 mr-2" />
                      <span className="text-gray-700">Chat with actors before ordering</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700">Check availability and delivery times</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-8">
                  <img 
                    src="https://images.pexels.com/photos/7433822/pexels-photo-7433822.jpeg"
                    alt="Actor search interface"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">2</span>
                    <h2 className="text-2xl font-bold text-gray-900">Prepare Your Content</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Share your script and requirements with the actor. Our platform makes it easy to communicate your vision and expectations.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-purple-500 mt-1 mr-2" />
                      <span className="text-gray-700">Upload your script and visual guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <Video className="h-5 w-5 text-red-500 mt-1 mr-2" />
                      <span className="text-gray-700">Specify video style and tone preferences</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700">Set delivery timeline and requirements</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-8">
                  <img 
                    src="https://images.pexels.com/photos/7433821/pexels-photo-7433821.jpeg"
                    alt="Content preparation"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">3</span>
                    <h2 className="text-2xl font-bold text-gray-900">Review and Approve</h2>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Receive your video and request revisions if needed. Our actors work with you to ensure you're completely satisfied with the final result.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Video className="h-5 w-5 text-blue-500 mt-1 mr-2" />
                      <span className="text-gray-700">Preview the completed video</span>
                    </li>
                    <li className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700">Request revisions if needed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-2" />
                      <span className="text-gray-700">Download the final video in high quality</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-8">
                  <img 
                    src="https://images.pexels.com/photos/7433823/pexels-photo-7433823.jpeg"
                    alt="Video review process"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Create Professional Videos?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/search'}
                >
                  Find an Actor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/become-actor'}
                >
                  Become an Actor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorks;