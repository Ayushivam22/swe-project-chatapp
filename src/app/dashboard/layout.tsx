import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="h-screen w-full">{children}</main>;
}
