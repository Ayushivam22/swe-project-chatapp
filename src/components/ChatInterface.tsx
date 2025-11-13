"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface ChatInterfaceProps {
  selectedUserId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedUserId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, messages, currentUser, users } = useWebSocket();

  const selectedUser = useMemo(() => users.find(u => u.userId === selectedUserId) || null, [users, selectedUserId]);

  // Filter messages for the selected conversation
  const conversationMessages = messages.filter(
    msg => 
      (msg.from === selectedUserId && msg.to === currentUser?.userId) ||
      (msg.from === currentUser?.userId && msg.to === selectedUserId)
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUserId) {
      sendMessage({
        to: selectedUserId,
        content: message.trim(),
      });
      setMessage('');
    }
  };

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select a conversation</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose a contact to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedUser?.username || selectedUserId}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Say hello!</p>
          </div>
        ) : (
          conversationMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === currentUser?.userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.from === currentUser?.userId
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
