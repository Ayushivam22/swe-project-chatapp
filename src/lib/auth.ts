import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    // Ensure NextAuth has the secret available to sign/decrypt JWTs
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Enter Your Email Heree' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Your Password Heree' }
            },
            async authorize(credentials) {
                console.log("control reacher authorize");
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    console.log("Mongo connection : ");
                    const mongo = await connectDB();
                    // console.log("Mongo connected",mongo)

                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    console.log('User is ', user?.email);
                    if (!user) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        name: user.name,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            // console.log("Token : ",token)
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin'
    },
};