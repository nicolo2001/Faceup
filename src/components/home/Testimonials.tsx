import React from 'react';
import Avatar from '../ui/Avatar';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Working with actors from FaceUp transformed my content. I now have professional videos without the stress of being on camera myself.",
    name: "Sarah Johnson",
    role: "E-Commerce Store Owner",
    avatarUrl: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
  },
  {
    text: "My product demos look so much more professional now. The actors on FaceUp were able to explain my product better than I ever could!",
    name: "David Chen",
    role: "SaaS Founder",
    avatarUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  },
  {
    text: "The quality of talent on this platform is outstanding. I found the perfect spokesperson for my brand in just one day.",
    name: "Fatima Al-Zahra",
    role: "Marketing Director",
    avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Hear from content creators who have transformed their video content with FaceUp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white border-opacity-20"
            >
              <Quote className="h-8 w-8 text-indigo-300 mb-4" />
              <p className="text-white mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <Avatar 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.name} 
                  size="md" 
                />
                <div className="ml-3">
                  <h4 className="font-medium text-white">{testimonial.name}</h4>
                  <p className="text-indigo-200 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;