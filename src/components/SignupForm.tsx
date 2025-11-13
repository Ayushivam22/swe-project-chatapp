"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function SignupForm() {
    const Router = useRouter();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Replace with your actual API endpoint
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Signup failed");
            }

            setSuccess(true);
            setForm({ name: "", username: "", email: "", password: "" });
            Router.push("/auth/signin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-100" />
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 rounded-lg border border-neutral-600 w-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-900 transition placeholder-gray-300"
                    required
                />
            </div>
            <div className="relative">
                <FaUserTag className="absolute left-3 top-3 text-gray-100" />
                <input
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={form.username}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 rounded-lg border border-neutral-600 w-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-900 transition placeholder-gray-300"
                    required
                />
            </div>
            <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-100" />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 rounded-lg border border-neutral-600 w-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-900 transition placeholder-gray-300"
                    required
                />
            </div>
            <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-100" />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className="relative pl-10 pr-14 py-2 text-gray-100 rounded-lg border border-neutral-600 w-full focus:outline-none focus:ring-2 focus:ring-amber-900 transition placeholder-gray-300"
                    required
                />
                <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-amber-800 cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <IoEyeOff /> : <IoEye />}
                </span>
            </div>
            <button
                type="submit"
                className="mt-2 bg-amber-900 text-white font-semibold py-2 rounded-lg hover:bg-amber-800 transition"
                disabled={loading}
            >
                {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
                <p className="text-center text-amber-600 text-lg drop-shadow-amber-100/30 drop-shadow-sm">
                    Signup successful!
                </p>
            )}
        </form>
    );
}
