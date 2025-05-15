import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface ChatWindowProps {
  conversationId: string;
  otherUser: Profile;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, otherUser, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Avatar
            src={otherUser.avatar_url || undefined}
            alt={otherUser.full_name}
            size="md"
          />
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{otherUser.full_name}</h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender_id === currentUserId
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <p 
                className={`text-xs mt-1 ${
                  message.sender_id === currentUserId
                    ? 'text-indigo-200'
                    : 'text-gray-500'
                }`}
              >
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow