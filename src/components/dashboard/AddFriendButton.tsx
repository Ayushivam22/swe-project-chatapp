"use client";

import React, { useState } from "react";

// Mock API function
async function sendFriendRequest(
    username: string
): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    const data = await response.json();

    return { success: response.ok, message: data.message };
}

const AddFriendButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsLoading(true);
        setStatusMessage("");
        const result = await sendFriendRequest(username);
        setStatusMessage(result.message);
        setIsLoading(false);

        if (result.success) {
            // In a real app, you'd refetch the friends list or update state globally
            setTimeout(() => {
                setIsModalOpen(false);
                setUsername("");
                setStatusMessage("");
            }, 1500);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
            >
                Add Friend
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-neutral-800 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-neutral-700">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Add a Friend
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Enter your friend's username to send a request.
                        </p>
                        <form onSubmit={handleAddFriend}>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:bg-neutral-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                        </form>
                        {statusMessage && (
                            <p className="mt-4 text-center text-sm text-gray-300">
                                {statusMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AddFriendButton;
