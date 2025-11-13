"use client";

import React, { useState } from "react";
import { Chat } from "@/types";

interface ChatListProps {
    initialChats: Chat[];
    onSelectChat?: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ initialChats, onSelectChat }) => {
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const handleChatClick = (chatId: string) => {
        setActiveChatId(chatId);
        const selected = chats.find((c) => c.id === chatId);
        if (selected && onSelectChat) onSelectChat(selected);
        // In a real app, you would also mark messages as read here
    };

    return (
        <div className="col-span-12 md:col-span-3 bg-neutral-800/50 border-r border-neutral-700 flex flex-col">
            <div className="p-4 border-b border-neutral-700">
                <h2 className="text-xl font-bold text-white">Chats</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="p-2">
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                                activeChatId === chat.id
                                    ? "bg-amber-600/20"
                                    : "hover:bg-neutral-700/50"
                            }`}
                        >
                            <img
                                src={chat.participants[0].image || "/default-avatar.png"}
                                alt={chat.participants[0].name || "User"}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-100 truncate">
                                        {chat.participants[0].name}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                        {chat.lastMessageTimestamp}
                                    </p>
                                </div>
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-400 truncate">
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatList;
