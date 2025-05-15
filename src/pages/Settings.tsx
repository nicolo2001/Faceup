import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, Bell, Shield, Globe, Smartphone, 
  Mail, Camera, Trash2, AlertCircle, Check
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    profileVisibility: 'public',
    showActivity: true,
    showEmail: false
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Try to fetch the existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        // Create a new profile if none exists
        const newProfile = {
          id: user.id,
          full_name: '',
          email: user.email,
          user_type: 'creator',
          created_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .maybeSingle();

        if (createError) throw createError;
        
        setProfile(createdProfile);
        setFormData(prev => ({
          ...prev,
          fullName: '',
          email: user.email || '',
          phone: ''
        }));
      } else {
        setProfile(profile);
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: user.email || '',
          phone: profile.phone_number || ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setErrorMessage(error.message || 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const updates = {
        id: user.id,
        full_name: formData.fullName,
        phone_number: formData.phone,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setSuccessMessage('Settings updated successfully');
      await fetchUserData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setErrorMessage(error.message || 'Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500">
                  Upload a new profile picture or remove the current one
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              disabled
            />

            <Input
              id="phone"
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              icon={<Smartphone className="h-5 w-5 text-gray-400" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Two-factor authentication recommended
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Enhance your account security by enabling two-factor authentication.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Connected Devices
                    </h4>
                    <p className="text-sm text-gray-500">
                      Manage devices that are logged into your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Devices
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Login History
                    </h4>
                    <p className="text-sm text-gray-500">
                      View your recent login activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              <Button
                variant="outline"
                className="!border-red-200 !text-red-600 hover:!bg-red-50"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Push Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      SMS Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Profile Visibility
                    </h4>
                    <p className="text-sm text-gray-500">
                      Control who can see your profile
                    </p>
                  </div>
                  <select
                    name="profileVisibility"
                    value={formData.profileVisibility}
                    onChange={handleInputChange}
                    className="rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                  </select>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Activity Status
                    </h4>
                    <p className="text-sm text-gray-500">
                      Show when you're active
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="showActivity"
                      checked={formData.showActivity}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Show Email Address
                    </h4>
                    <p className="text-sm text-gray-500">
                      Allow others to see your email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={formData.showEmail}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Data Usage</h4>
              <p className="text-sm text-gray-500 mb-4">
                We collect and use your data as described in our Privacy Policy.
                You can control how your data is used below.
              </p>
              <Button variant="outline" size="sm">
                Manage Data Settings
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                  <nav className="space-y-1">
                    <button
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === 'profile'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Profile
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === 'security'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('security')}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      Security
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === 'notifications'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      Notifications
                    </button>
                    <button
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        activeTab === 'privacy'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('privacy')}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Privacy
                    </button>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  )}

                  {renderTabContent()}

                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <Button
                      onClick={handleSave}
                      isLoading={isSaving}
                      disabled={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;