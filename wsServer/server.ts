import { WebSocketServer, WebSocket } from 'ws';

interface User {
    userId: string;
    username: string;
    ws: WebSocket;
}

interface Message {
    type: 'message' | 'userList' | 'error' | 'userConnected' | 'userDisconnected';
    from?: string;
    to?: string;
    content?: string;
    users?: { userId: string; username: string }[];
    timestamp?: string;
}

const wss = new WebSocketServer({ port: 8080 });
const activeUsers = new Map<string, User>();

function broadcastUserList() {
    const userList = Array.from(activeUsers.values()).map(({ userId, username }) => ({
        userId,
        username
    }));

    const message: Message = {
        type: 'userList',
        users: userList
    };

    activeUsers.forEach(user => {
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', (ws: WebSocket, req) => {
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const userId = urlParams.get('userId') || `user-${Date.now()}`;
    const username = urlParams.get('username') || `User-${Math.floor(Math.random() * 1000)}`;

    // Add user to active users
    const user: User = { userId, username, ws };
    activeUsers.set(userId, user);
    console.log(`User ${username} (${userId}) connected`);

    // Notify all users about the new connection
    const connectMessage: Message = {
        type: 'userConnected',
        from: userId,
        content: `${username} has joined the chat`,
        timestamp: new Date().toISOString()
    };
    
    activeUsers.forEach(u => {
        if (u.ws.readyState === WebSocket.OPEN) {
            u.ws.send(JSON.stringify(connectMessage));
        }
    });

    // Send current user list to all clients
    broadcastUserList();

    // Handle incoming messages
    ws.on('message', (rawMessage: string) => {
        try {
            const message: Message = JSON.parse(rawMessage.toString());
            console.log('Received message:', message);
            
            if (message.type === 'message' && message.to && message.content) {
                const recipient = activeUsers.get(message.to);
                const sender = activeUsers.get(userId);
                
                if (recipient && recipient.ws.readyState === WebSocket.OPEN) {
                    const privateMessage: Message = {
                        type: 'message',
                        from: userId,
                        to: message.to,
                        content: message.content,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Send to recipient
                    recipient.ws.send(JSON.stringify(privateMessage));
                    
                    // Send back to sender for their own message history
                    if (sender?.ws.readyState === WebSocket.OPEN) {
                        sender.ws.send(JSON.stringify({
                            ...privateMessage,
                            isOwn: true
                        }));
                    }
                } else {
                    console.warn(`Recipient ${message.to} not connected or socket not open.`);
                    if (sender?.ws.readyState === WebSocket.OPEN) {
                        sender.ws.send(JSON.stringify({
                            type: 'error',
                            content: `User ${message.to} is not connected`,
                            timestamp: new Date().toISOString()
                        }));
                    }
                }
            }
        } catch (err) {
            console.error('Error processing message:', err);
            const errorMessage: Message = {
                type: 'error',
                content: 'Invalid message format'
            };
            ws.send(JSON.stringify(errorMessage));
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        const disconnectedUser = activeUsers.get(userId);
        if (disconnectedUser) {
            console.log(`User ${disconnectedUser.username} (${userId}) disconnected`);
            
            // Notify all users about the disconnection
            const disconnectMessage: Message = {
                type: 'userDisconnected',
                from: userId,
                content: `${disconnectedUser.username} has left the chat`,
                timestamp: new Date().toISOString()
            };
            
            activeUsers.forEach(u => {
                if (u.ws.readyState === WebSocket.OPEN) {
                    u.ws.send(JSON.stringify(disconnectMessage));
                }
            });
            
            // Remove user from active users
            activeUsers.delete(userId);
            broadcastUserList();
        }
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        activeUsers.delete(userId);
        broadcastUserList();
    });
});

console.log('WebSocket server running on ws://localhost:8080');
