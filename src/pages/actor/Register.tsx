import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Video, Calendar, Upload, Check } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { languageOptions, videoTypeOptions, toneOptions } from '../../data/mockData';

const steps = [
  { id: 'account', title: 'Account', description: 'Create your account' },
  { id: 'profile', title: 'Profile', description: 'Professional details' },
  { id: 'portfolio', title: 'Portfolio', description: 'Upload your work' },
  { id: 'availability', title: 'Availability', description: 'Set your schedule' },
  { id: 'verification', title: 'Verification', description: 'Identity check' }
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    professionalName: '',
    languages: [] as string[],
    videoTypes: [] as string[],
    tones: [] as string[],
    basePrice: '',
    tagline: '',
    bio: '',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    timezone: 'UTC',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSelection = (field: 'languages' | 'videoTypes' | 'tones', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const toggleAvailability = (day: keyof typeof formData.availability) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit form
      navigate('/actor/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
            <div className="text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="professionalName"
              name="professionalName"
              label="Professional Name"
              required
              value={formData.professionalName}
              onChange={handleInputChange}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map(language => (
                  <button
                    key={language}
                    onClick={() => toggleSelection('languages', language)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.languages.includes(language)
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Types
              </label>
              <div className="flex flex-wrap gap-2">
                {videoTypeOptions.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleSelection('videoTypes', type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.videoTypes.includes(type)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tones
              </label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map(tone => (
                  <button
                    key={tone}
                    onClick={() => toggleSelection('tones', tone)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.tones.includes(tone)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="basePrice"
              name="basePrice"
              label="Base Price ($)"
              type="number"
              required
              value={formData.basePrice}
              onChange={handleInputChange}
              icon={<span className="text-gray-400">$</span>}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <textarea
                name="tagline"
                rows={2}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3"
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Your Demo Videos
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your video files here, or click to browse
                </p>
                <Button variant="outline">
                  Browse Files
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Video format: MP4 or MOV
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Maximum file size: 500MB per video
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Minimum 2 demo videos required
                </li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.workingHours.start}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, start: e.target.value }
                    }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.workingHours.end}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, end: e.target.value }
                    }))}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST (UTC-5)</option>
                <option value="PST">PST (UTC-8)</option>
                {/* Add more timezones */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(formData.availability).map(([day, isAvailable]) => (
                  <button
                    key={day}
                    onClick={() => toggleAvailability(day as keyof typeof formData.availability)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {day.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Verification Documents
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please provide a government-issued ID and proof of address
                </p>
                <Button variant="outline">
                  Upload Documents
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Government-issued ID (passport, driver's license)
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Proof of address (utility bill, bank statement)
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Documents must be less than 3 months old
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 ${index !== steps.length - 1 ? 'relative' : ''}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= currentStep
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={`hidden sm:block absolute top-4 w-full h-0.5 ${
                          index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep].description}
                </p>
              </div>

              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Complete Registration' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;