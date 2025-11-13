"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-6 items-center w-full max-w-md backdrop-blur-md border border-neutral-500 rounded-2xl p-10 shadow-2xl bg-black/40">
        <h1 className="text-3xl text-yellow-50 font-bold w-full text-center mb-2">
          Welcome to ChatConnect
        </h1>
        <p className="text-gray-300 text-center mb-4">
          Connect, chat, and share moments with friends and the world.
          Enjoy real-time messaging, group chats, and a vibrant social
          community—all in one place.
        </p>
        <div className="flex gap-4 w-full justify-center">
          <Link href="/auth/signin">
            <button className="px-6 py-2 rounded-full bg-amber-600/90 text-white font-semibold shadow-md hover:bg-amber-700 transition">
              Sign In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-6 py-2 rounded-full bg-amber-400/90 text-white font-semibold shadow-md hover:bg-amber-500 transition">
              Sign Up
            </button>
          </Link>
        </div>
        <div className="mt-4 text-gray-400 text-sm text-center">
          ChatConnect &copy; 2025
        </div>
      </div>
    </div>
  );
}
