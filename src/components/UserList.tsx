"use client";

import React, { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface UserListProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ selectedUserId, onSelectUser }) => {
  const { users, currentUser } = useWebSocket();
  
  // Filter out the current user from the list
  const otherUsers = users.filter(user => user.userId !== currentUser?.userId);

  // Auto-select the first user if none is selected
  useEffect(() => {
    if (!selectedUserId && otherUsers.length > 0) {
      onSelectUser(otherUsers[0].userId);
    }
  }, [selectedUserId, otherUsers, onSelectUser]);

  if (otherUsers.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No other users online</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-2">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Online Users
        </h3>
        <nav className="space-y-1">
          {otherUsers.map((user) => (
            <button
              key={user.userId}
              onClick={() => onSelectUser(user.userId)}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedUserId === user.userId
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 mr-3 rounded-full bg-green-500"></span>
              <span className="truncate">{user.username || user.userId}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default UserList;
