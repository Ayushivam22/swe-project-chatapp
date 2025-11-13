"use client";

import React, { useState } from "react";
import { User, Friend, FriendRequest } from "@/types";
import AddFriendButton from "./AddFriendButton";
import Avatar from "@/components/common/Avatar";
import { Check, X } from "lucide-react";

interface SidebarProps {
    user: User;
    friends: Friend[];
    initialPendingRequests: FriendRequest[];
    onSelectFriend: (friend: Friend) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    user,
    friends = [],
    initialPendingRequests = [],
    onSelectFriend,
}) => {
    const [pendingRequests, setPendingRequests] = useState(
        initialPendingRequests
    );
    const [loadingRequestId, setLoadingRequestId] = useState<string | null>(
        null
    );

    const handleRespond = async (
        requestId: string,
        status: "accepted" | "rejected"
    ) => {
        setLoadingRequestId(requestId);
        try {
            const response = await fetch(`/api/friends/respond/${requestId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setPendingRequests((prev) =>
                    prev.filter((req) => req.id !== requestId)
                );
                // In a real app, you might want to show a success toast
                // and update the main friends list if a request was accepted.
            } else {
                // Handle error, maybe show a toast
                console.error("Failed to respond to friend request");
            }
        } catch (error) {
            console.error("Error responding to friend request:", error);
        } finally {
            setLoadingRequestId(null);
        }
    };

    return (
        <aside className="hidden md:flex md:flex-col md:col-span-3 bg-neutral-800 p-4 border-r border-neutral-700">
            {/* User Profile Section */}
            <div className="flex items-center  gap-4 mb-6 p-2">
                <div>
                    <Avatar
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        size={48}
                    />
                    <div>
                        <h2 className="font-semibold text-lg text-white">
                            {user.name || user.email}
                        </h2>
                        <p className="text-sm text-green-400 capitalize">
                            {user.status}
                        </p>
                    </div>
                </div>
                <div></div>
            </div>

            {/* Add Friend Button */}
            <AddFriendButton />

            {/* Pending Friend Requests */}
            {pendingRequests.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-400 mb-2 px-2">
                        Pending Requests
                    </h3>
                    <ul className="space-y-2">
                        {pendingRequests.map((request) => (
                            <li
                                key={request.id}
                                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-neutral-700/50"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            request.sender.image ||
                                            "/default-avatar.png"
                                        }
                                        alt={request.sender.name || "User"}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="font-medium text-gray-200 truncate">
                                        {request.sender.name ||
                                            request.sender.email}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleRespond(
                                                request.id,
                                                "accepted"
                                            )
                                        }
                                        disabled={
                                            loadingRequestId === request.id
                                        }
                                        className="p-1.5 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/40 disabled:opacity-50 transition-colors"
                                        aria-label="Accept"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRespond(
                                                request.id,
                                                "rejected"
                                            )
                                        }
                                        disabled={
                                            loadingRequestId === request.id
                                        }
                                        className="p-1.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 disabled:opacity-50 transition-colors"
                                        aria-label="Reject"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Friends List */}
            <div className="flex-1  overflow-y-auto mt-4">
                <h3 className="text-md font-semibold text-gray-400 mb-2 px-2">
                    Friends
                </h3>
                <ul className="space-y-2">
                    {friends.map((friend) => (
                        <li
                            key={friend.id}
                            onClick={() => onSelectFriend(friend)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700 cursor-pointer transition-colors"
                        >
                            <div className="relative">
                                <Avatar
                                    src={friend.image}
                                    alt={friend.name || "Friend"}
                                    size={40}
                                />
                                {friend.status === "online" && (
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-neutral-800"></span>
                                )}
                            </div>
                            <span className="font-medium text-gray-200">
                                {friend.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
