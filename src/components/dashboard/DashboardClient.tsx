"use client";

import React, { useState, useEffect } from "react";
import { User, Friend, Chat, FriendRequest } from "@/types";
import Sidebar from "./Sidebar";
// import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useWebSocket } from "@/contexts/WebSocketContext";
import MobileFriendsDrawer from "./MobileFriendsDrawer";

interface DashboardClientProps {
    user: User;
    friends: Friend[];
    initialPendingRequests: FriendRequest[];
    initialChats: Chat[];
}

export default function DashboardClient({
    user,
    friends,
    initialPendingRequests,
    initialChats,
}: DashboardClientProps) {
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const ws = useWebSocket();
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // WebSocket connection is handled by WebSocketProvider

    const handleSelectFriend = (friend: Friend) => {
        // Find if a chat with this friend already exists
        const existingChat = chats.find((chat) =>
            chat.participants.some((p) => p.id === friend.id)
        );

        if (existingChat) {
            setActiveChat(existingChat);
            ws.connect(friend.id);
            ws.setRecipient(friend.id);
        } else {
            // Create a new local chat object. In a real app, you'd likely create this on the server.
            const newChat: Chat = {
                id: `new_${friend.id}_${Date.now()}`, // Temporary unique ID
                participants: [friend],
                lastMessage: `Started a chat with ${friend.name}`,
                lastMessageTimestamp: new Date().toLocaleTimeString(),
                unreadCount: 0,
            };
            setChats((prev) => [newChat, ...prev]);
            setActiveChat(newChat);
            ws.connect(friend.id);
            ws.setRecipient(friend.id);
        }
    };

    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
        const recipientId = chat.participants[0]?.id;
        if (recipientId) {
            ws.connect(recipientId);
            ws.setRecipient(recipientId);
        }
    };

    return (
        <div className="grid grid-cols-12 h-screen w-full bg-neutral-900 text-white">
            <Sidebar
                user={user}
                friends={friends}
                initialPendingRequests={initialPendingRequests}
                onSelectFriend={handleSelectFriend}
            />
            <div className="col-span-12 md:col-span-9 flex flex-col">
                {/* Chats list removed as requested */}
                <ChatWindow
                    activeChat={activeChat}
                    currentUser={user}
                    onOpenFriends={() => setIsMobileDrawerOpen(true)}
                />
            </div>
            {isMobileDrawerOpen && (
                <MobileFriendsDrawer
                    user={user}
                    friends={friends}
                    initialPendingRequests={initialPendingRequests}
                    onSelectFriend={handleSelectFriend}
                    onClose={() => setIsMobileDrawerOpen(false)}
                />
            )}
        </div>
    );
}
