import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { supabase } from '../../lib/supabase';

interface Conversation {
  id: string;
  creator_id: string;
  actor_id: string;
  updated_at: string;
  last_message?: {
    content: string;
    created_at: string;
  };
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface ConversationsListProps {
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  currentUserId,
  onSelectConversation,
  selectedConversationId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            creator:creator_id(id, full_name, avatar_url),
            actor:actor_id(id, full_name, avatar_url),
            messages:messages(
              content,
              created_at
            )
          `)
          .or(`creator_id.eq.${currentUserId},actor_id.eq.${currentUserId}`)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formattedConversations = data.map(conv => ({
          ...conv,
          other_user: conv.creator_id === currentUserId ? conv.actor : conv.creator,
          last_message: conv.messages[conv.messages.length - 1]
        }));

        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to updates
    const subscription = supabase
      .channel('conversations_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `creator_id=eq.${currentUserId},actor_id=eq.${currentUserId}`,
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId]);

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar
                    src={conversation.other_user.avatar_url || undefined}
                    alt={conversation.other_user.full_name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.other_user.full_name}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-gray-500 mb-2">No conversations found</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList