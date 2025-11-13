import connectDB from "@/lib/db";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest";
import {
    Friend,
    Chat,
    FriendRequest as FriendRequestType,
} from "@/types";
import Friendship from "@/models/Friendship";

export async function fetchFriends(userId: string): Promise<Friend[]> {
    await connectDB();
    console.log("Fetching friends for user:", userId);

    // Find all friendships where the current user is either user1 or user2
    const friendships = await Friendship.find({
        $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2"); // Populate both sides of the friendship

    const friendsList: Friend[] = [];
    for (const friendship of friendships) {
        const friendUser =
            friendship.user1._id.toString() === userId
                ? friendship.user2
                : friendship.user1;
        friendsList.push({
            id: friendUser._id.toString(),
            name: friendUser.name,
            email: friendUser.email,
            image: friendUser.image,
            status: "online", // Placeholder status
        });
    }

    return friendsList;
}

export async function fetchPendingRequests(
    userId: string
): Promise<FriendRequestType[]> {
    await connectDB();
    console.log("Fetching pending requests for user:", userId);
    const requests = await FriendRequest.find({
        receiver: userId,
        status: "pending",
    }).populate("sender");
    return requests.map((req: any) => ({
        id: req._id.toString(),
        sender: {
            id: req.sender._id.toString(),
            name: req.sender.name,
            email: req.sender.email,
            image: req.sender.image,
        },
    }));
}

export async function fetchChats(userId: string): Promise<Chat[]> {
    // Placeholder logic
    console.log("Fetching chats for user:", userId);
    return [
        {
            id: "chat1",
            participants: [{ id: "2", name: "Jane Doe", image: null }],
            lastMessage: "Hey, how are you?",
            lastMessageTimestamp: "10:30 AM",
            unreadCount: 2,
        },
        {
            id: "chat2",
            participants: [{ id: "3", name: "Peter Jones", image: null }],
            lastMessage: "See you tomorrow!",
            lastMessageTimestamp: "Yesterday",
            unreadCount: 0,
        },
    ];
}