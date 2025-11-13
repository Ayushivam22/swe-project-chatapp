"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";

interface WebSocketMessage {
    type:
        | "message"
        | "userList"
        | "error"
        | "userConnected"
        | "userDisconnected";
    from?: string;
    to?: string;
    content?: string;
    users?: Array<{ userId: string; username: string }>;
    timestamp?: string;
    isOwn?: boolean;
}

interface WebSocketContextType {
    sendMessage: (message: { to?: string; content: string }) => void;
    messages: WebSocketMessage[];
    users: Array<{ userId: string; username: string }>;
    currentUser: { userId: string; username: string } | null;
    isConnected: boolean;
    connect: (recipientId?: string) => void;
    disconnect: () => void;
    setRecipient: (recipientId: string | null) => void;
    selectedRecipientId: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
);

export const WebSocketProvider: React.FC<{
    children: ReactNode;
    userId: string;
    username: string;
}> = ({ children, userId, username }) => {
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [users, setUsers] = useState<
        Array<{ userId: string; username: string }>
    >([]);
    const [isConnected, setIsConnected] = useState(false);
    const [selectedRecipientId, setSelectedRecipientId] = useState<
        string | null
    >(null);
    const ws = useRef<WebSocket | null>(null);

    const connect = (recipientId?: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            if (recipientId) setSelectedRecipientId(recipientId);
            return;
        }
        const wsUrl = `wss://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?userId=${encodeURIComponent(
            userId
        )}&username=${encodeURIComponent(username)}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
            if (recipientId) setSelectedRecipientId(recipientId);
        };

        socket.onmessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);

                switch (message.type) {
                    case "message":
                        // Ignore server echo of our own message (we already optimistically appended)
                        if (message.isOwn) return;
                        setMessages((prev) => [...prev, message]);
                        break;
                    case "userList":
                        setUsers(message.users || []);
                        break;
                    case "userConnected":
                    case "userDisconnected":
                        // user list will be refreshed via userList broadcast
                        break;
                    default:
                        console.log("Unhandled message type:", message.type);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        ws.current = socket;
    };

    // Ensure we have a live socket so we can receive messages even before selecting a friend
    useEffect(() => {
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connect();
        }
        // Clean up on unmount
        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    const disconnect = () => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        setIsConnected(false);
    };

    const setRecipient = (recipientId: string | null) => {
        setSelectedRecipientId(recipientId);
    };

    const sendMessage = ({ to, content }: { to?: string; content: string }) => {
        const target = to || selectedRecipientId;
        if (!target) return;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = {
                type: "message",
                to: target,
                content,
                timestamp: new Date().toISOString(),
            };
            // Optimistic update for immediate UI feedback
            setMessages((prev) => [
                ...prev,
                {
                    ...message,
                    from: userId,
                    isOwn: true,
                } as WebSocketMessage,
            ]);
            ws.current.send(JSON.stringify(message));
        }
    };

    const value: WebSocketContextType = {
        sendMessage,
        messages,
        users,
        currentUser: { userId, username },
        isConnected,
        connect,
        disconnect,
        setRecipient,
        selectedRecipientId,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};
