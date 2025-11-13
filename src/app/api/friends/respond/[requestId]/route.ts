import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Friendship from '@/models/Friendship';
import FriendRequest from '@/models/FriendRequest';
import mongoose from 'mongoose';

export async function POST(req: Request, ctx: { params: Promise<{ requestId: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { requestId } = await ctx.params;
    const { status } = await req.json(); // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ message: "Invalid status. Must be 'accepted' or 'rejected'." }, { status: 400 });
    }

    const request = await FriendRequest.findOne({ _id: requestId, receiver: currentUser._id, status: 'pending' });

    if (!request) {
      return NextResponse.json({ message: 'Pending friend request not found.' }, { status: 404 });
    }

    if (status === 'accepted') {
      // Use a transaction to ensure both users are updated atomically.
      const mongooseSession = await mongoose.startSession();
      await mongooseSession.withTransaction(async () => {
        request.status = 'accepted';
        await request.save({ session: mongooseSession });

        // Create a new friendship entry. Ensure canonical order to prevent duplicates.
        const userA = request.sender;
        const userB = currentUser._id;

        // Determine canonical order for user1 and user2 based on their ObjectId string representation
        const [user1, user2] =
          userA.toString() < userB.toString() ? [userA, userB] : [userB, userA];

        await Friendship.create(
          [{ user1, user2 }],
          { session: mongooseSession }
        );
      });
      mongooseSession.endSession();

      return NextResponse.json({ message: 'Friend request accepted.' }, { status: 200 });
    } else { // 'rejected'
      // Instead of deleting, we mark as rejected to prevent spamming the same user.
      // You could also delete it if you prefer: await FriendRequest.findByIdAndDelete(request._id);
      request.status = 'rejected';
      await request.save();
      return NextResponse.json({ message: 'Friend request rejected.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error responding to friend request:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
