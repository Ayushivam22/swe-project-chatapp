"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chat, User } from "@/types";
import { useWebSocket } from "@/contexts/WebSocketContext";
import Avatar from "@/components/common/Avatar";

interface ChatWindowProps {
    activeChat: Chat | null;
    currentUser: User;
    onOpenFriends?: () => void; // mobile toggle
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeChat, currentUser, onOpenFriends }) => {
    const [message, setMessage] = useState("");
    const { messages, sendMessage, isConnected } = useWebSocket();
    const bottomRef = useRef<HTMLDivElement>(null);

    const otherParticipant = useMemo(() => activeChat?.participants[0] || null, [activeChat]);

    // Filter messages for this conversation (currentUser <-> otherParticipant)
    const conversationMessages = useMemo(() => {
        if (!otherParticipant) return [] as Array<{ from?: string; to?: string; content?: string; timestamp?: string }>;
        return messages.filter(
            (m) =>
                (m.from === currentUser.id && m.to === otherParticipant.id) ||
                (m.from === otherParticipant.id && m.to === currentUser.id)
        );
    }, [messages, currentUser.id, otherParticipant]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages.length]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !activeChat || !otherParticipant) return;

        sendMessage({ to: otherParticipant.id, content: message.trim() });
        setMessage("");
    };

    if (!activeChat) {
        return (
            <div className="flex flex-col flex-1 bg-neutral-900">
                {/* Mobile header with friends toggle */}
                <div className="md:hidden flex items-center justify-between p-3 border-b border-neutral-800">
                    <button
                        onClick={onOpenFriends}
                        className="px-3 py-2 rounded-md bg-neutral-800 text-gray-200"
                    >
                        Friends
                    </button>
                    <div className="text-gray-300 text-sm">No chat selected</div>
                    <div className="w-16" />
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-400">
                            Select a chat to start messaging
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Your conversations will appear here.
                        </p>
                    </div>
                </div>
                <div className="p-4 border-t border-neutral-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled
                        />
                        <button
                            className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg disabled:opacity-50"
                            disabled
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const op = otherParticipant!;

    return (
        <div className="flex flex-col flex-1 bg-neutral-900">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <button
                    onClick={onOpenFriends}
                    className="md:hidden px-3 py-2 rounded-md bg-neutral-800 text-gray-200"
                >
                    Friends
                </button>
                <div className="flex items-center gap-3">
                    <Avatar src={op.image} alt={op.name || "User"} size={40} />
                    <h3 className="text-lg font-semibold text-white">
                        {op.name}
                    </h3>
                </div>
                <div className="w-20" />
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversationMessages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet. Say hello!</p>
                ) : (
                    conversationMessages.map((m, idx) => {
                        const isMine = m.from === currentUser.id;
                        const sender = isMine ? currentUser : op;
                        return (
                            <div key={idx} className={`flex items-start gap-3 ${isMine ? "justify-end" : "justify-start"}`}>
                                {!isMine && (
                                    <Avatar
                                        src={sender.image}
                                        alt={sender.name || sender.email || "User"}
                                        size={36}
                                        className="mt-1"
                                    />
                                )}
                                <div className={`max-w-[70%]`}
                                >
                                    <div className={`text-xs font-semibold mb-1 ${isMine ? "text-amber-400 text-right" : "text-gray-300"}`}>
                                        {sender.name || sender.email || (isMine ? "You" : "User")}
                                    </div>
                                    <div className={`${isMine ? "bg-amber-600 text-white" : "bg-neutral-800 text-white"} px-4 py-2 rounded-2xl ${isMine ? "rounded-br-none ml-auto" : "rounded-bl-none"}`}>
                                        <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                                        {m.timestamp && (
                                            <p className="text-[10px] opacity-70 text-right mt-1">
                                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isMine && (
                                    <Avatar
                                        src={sender.image}
                                        alt={sender.name || sender.email || "You"}
                                        size={36}
                                        className="mt-1"
                                    />
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${op.name || op.email || "user"}...`}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || !isConnected}
                        className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
                {!isConnected && (
                    <p className="mt-2 text-xs text-gray-400">Connecting… click a friend to start a chat.</p>
                )}
            </form>
        </div>
    );
};

export default ChatWindow;
