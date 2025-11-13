import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Friendship from '@/models/Friendship';
import FriendRequest from '@/models/FriendRequest';

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    console.log("Server Session : ", session)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const sender = await User.findOne({ email: session.user.email });
    if (!sender) {
      return NextResponse.json({ message: 'Sender not found' }, { status: 404 });
    }

    const { username: receiverUsername } = await req.json();

    if (receiverUsername === sender.username) {
      return NextResponse.json({ message: 'You cannot send a friend request to yourself.' }, { status: 400 });
    }

    const receiver = await User.findOne({ username: receiverUsername });
    if (!receiver) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // 1. Check if they are already friends
    const existingFriendship = await Friendship.findOne({
      $or: [
        { user1: sender._id, user2: receiver._id },
        { user1: receiver._id, user2: sender._id },
      ],
    });
    if (existingFriendship) {
      return NextResponse.json({ message: 'You are already friends with this user.' }, { status: 409 });
    }

    // 2. Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: sender._id, receiver: receiver._id },
        { sender: receiver._id, receiver: sender._id },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return NextResponse.json({ message: 'A friend request is already pending.' }, { status: 409 });
      }
      // If rejected, allow a new request. You might want to add a cooldown here.
      // If accepted, the "already friends" check above should have caught it.
    }

    const friendRequest = await FriendRequest.create({
      sender: sender._id,
      receiver: receiver._id,
    });

    return NextResponse.json({ message: 'Friend request sent.', friendRequest }, { status: 201 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
