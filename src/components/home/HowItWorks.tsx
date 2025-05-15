import React from 'react';
import { FileText, Video, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <FileText className="h-8 w-8 text-indigo-600" />,
    title: 'Prepare Your Content',
    description: 'Upload your script and any visual guidelines for the actor to follow.',
  },
  {
    icon: <Video className="h-8 w-8 text-indigo-600" />,
    title: 'Actor Creates Your Video',
    description: 'Our professional talent brings your content to life with high-quality video.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
    title: 'Review and Approve',
    description: 'Review the finished video and request revisions if needed before final delivery.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How FaceUp Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get professional videos without appearing on camera yourself in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="rounded-lg p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-50 rounded-full">{step.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">
                {step.description}
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;