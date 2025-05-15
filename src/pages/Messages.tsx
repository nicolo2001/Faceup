import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ConversationsList from '../components/messaging/ConversationsList';
import ChatWindow from '../components/messaging/ChatWindow';
import { supabase } from '../lib/supabase';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) throw new Error('No authenticated user found');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          // Profile doesn't exist - redirect to profile creation
          setError('Please complete your profile to access messages');
          setTimeout(() => {
            navigate('/actor/register');
          }, 3000);
          return;
        }

        setCurrentUser(profile);
        setError(null);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError(error instanceof Error ? error.message : 'Failed to load user profile');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !currentUser) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Please sign in to access messages'}
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.includes('complete your profile') 
                ? 'You will be redirected to complete your profile setup.'
                : error 
                  ? 'There was a problem loading your profile. Please try signing out and back in.'
                  : 'You need to be logged in to view and send messages.'}
            </p>
            {!error?.includes('complete your profile') && (
              <button
                onClick={() => navigate('/auth/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 h-full">
            <ConversationsList
              currentUserId={currentUser.id}
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 h-full">
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation.id}
                otherUser={selectedConversation.other_user}
                currentUserId={currentUser.id}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;