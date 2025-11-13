"use client";

import React from "react";
import { Friend, FriendRequest, User } from "@/types";
import Avatar from "@/components/common/Avatar";

interface MobileFriendsDrawerProps {
  user: User;
  friends: Friend[];
  initialPendingRequests: FriendRequest[];
  onSelectFriend: (friend: Friend) => void;
  onClose: () => void;
}

export default function MobileFriendsDrawer({
  user,
  friends,
  initialPendingRequests,
  onSelectFriend,
  onClose,
}: MobileFriendsDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-y-0 left-0 w-5/6 max-w-sm bg-neutral-900 border-r border-neutral-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <Avatar src={user.image} alt={user.name || "User"} size={40} />
          <div className="flex-1">
            <div className="text-white font-semibold leading-tight">
              {user.name || user.email}
            </div>
            <div className="text-xs text-green-400 capitalize">{user.status}</div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          >
            Close
          </button>
        </div>

        {/* Friends */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 px-4 pt-4 pb-2">
            Friends
          </h3>
          <ul className="space-y-1 px-2 pb-6">
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => {
                  onSelectFriend(friend);
                  onClose();
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <div className="relative">
                  <Avatar src={friend.image} alt={friend.name || "Friend"} size={40} />
                  {friend.status === "online" && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-neutral-900" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-gray-200 font-medium truncate">
                    {friend.name || friend.email}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
