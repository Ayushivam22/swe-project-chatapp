import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Real Time Chat App",
    description: "Chat with your friend in real time.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <div className="min-h-screen bg-[url('/assets/bg.svg')] bg-cover bg-no-repeat">
                        <div className="min-h-screen w-full backdrop-blur-md">
                            {children}
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
