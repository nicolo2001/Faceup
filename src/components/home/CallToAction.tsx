import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to create professional videos?
              </h2>
              <p className="text-white text-lg">
                Find the perfect actor for your next video project and start creating content that stands out.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white !text-blue-700 hover:!bg-blue-50 !border-2 !border-white transition-all duration-200"
                onClick={() => navigate('/search')}
              >
                Find an Actor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto !border-2 !border-white !text-white hover:!bg-white/10 transition-all duration-200"
                onClick={() => navigate('/become-actor')}
              >
                Become an Actor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;