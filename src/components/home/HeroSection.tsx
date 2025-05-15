import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const categories = [
  {
    title: 'Tutorial Videos',
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg',
    startingPrice: 150
  },
  {
    title: 'E-commerce Product Videos',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    startingPrice: 200
  },
  {
    title: 'Corporate Presentations',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    startingPrice: 250
  },
  {
    title: 'Training Videos',
    image: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg',
    startingPrice: 175
  },
  {
    title: 'Testimonials',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
    startingPrice: 125
  }
];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(nextSlide, 8000);
      return () => clearInterval(timer);
    }
  }, [isPaused, nextSlide]);

  const handleSlideHover = (hovering: boolean) => {
    setIsPaused(hovering);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <>
      <div 
        className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white min-h-[90vh] flex items-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-blue-800/70 backdrop-blur-[2px]"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Be the <span className="text-blue-300">1st</span> Face of a new economy
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white max-w-3xl mx-auto">
              monetize your image now, before anyone else
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="!bg-white/95 backdrop-blur-sm !text-blue-700 hover:!bg-white transition-all duration-300 !px-10 !py-6 text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                onClick={() => navigate('/search')}
              >
                Find an Actor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!border-2 !border-white bg-white/10 !text-white hover:bg-white/20 transition-all duration-300 !px-10 !py-6 text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                onClick={() => navigate('/become-actor')}
              >
                Become an Actor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Slider Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Explore Video Categories
          </h2>
          <div 
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => handleSlideHover(true)}
            onMouseLeave={() => handleSlideHover(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Category slider"
          >
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-blue-600 hover:bg-blue-700 rounded-full p-3 text-white z-10 transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-blue-600 hover:bg-blue-700 rounded-full p-3 text-white z-10 transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Slider */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="min-w-full flex flex-col items-center gap-4 p-8"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={category.title}
                  >
                    <div 
                      className="w-full h-[500px] rounded-xl overflow-hidden relative group cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                      style={{
                        backgroundImage: `url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onClick={() => navigate(`/search?category=${encodeURIComponent(category.title)}`)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-10 group-hover:from-black/90 transition-all duration-300">
                        <div className="text-left transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                          <h3 className="text-3xl font-bold text-white mb-3">{category.title}</h3>
                          <p className="text-blue-300 text-2xl font-semibold">
                            Starting at ${category.startingPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation Dots */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-3rem] flex justify-center gap-3">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-600 w-10' : 'bg-gray-300 w-3 hover:bg-blue-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;