import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User as UserType } from "@/types";
import { fetchFriends, fetchChats, fetchPendingRequests } from "@/lib/data";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

export default async function Dashboard() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin?callbackUrl=/dashboard");
    }

    const currentUser: UserType = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        status: "online", // Placeholder
    };

    // Fetch initial data on the server
    const [friends, chats, pendingRequests] = await Promise.all([
        fetchFriends(currentUser.id),
        fetchChats(currentUser.id),
        fetchPendingRequests(currentUser.id),
    ]);

    return (
        <WebSocketProvider userId={currentUser.id} username={currentUser.name || currentUser.email || "User"}>
            <DashboardClient
                user={currentUser}
                friends={friends}
                initialPendingRequests={pendingRequests}
                initialChats={chats}
            />
        </WebSocketProvider>
    );
}
