import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFriendRequest extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
}

const FriendRequestSchema: Schema = new Schema({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    receiver: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.models.FriendRequest || mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
