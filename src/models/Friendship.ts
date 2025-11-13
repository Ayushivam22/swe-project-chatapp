import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFriendship extends Document {
    user1: Types.ObjectId;
    user2: Types.ObjectId;
    createdAt: Date;
}

const FriendshipSchema: Schema = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure that a friendship between two users is unique, regardless of order.
// For example, { user1: A, user2: B } is the same as { user1: B, user2: A }.
// We'll enforce a canonical order (e.g., user1's ID is always "less" than user2's ID)
// when creating/checking friendships to maintain uniqueness.
FriendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.models.Friendship || mongoose.model<IFriendship>('Friendship', FriendshipSchema);