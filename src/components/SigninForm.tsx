"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function SigninForm() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (res?.error) {
            setError(
                res.error === "CredentialsSignin"
                    ? "Invalid email or password"
                    : res.error
            );
        } else if (res?.ok) {
            router.push("/dashboard");
        }

        setLoading(false);
    };

    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="relative pl-10 pr-14 py-2 text-gray-100 rounded-lg border border-neutral-600 w-full focus:outline-none focus:ring-2 focus:ring-amber-900 transition placeholder-gray-300"
                    required
                />
                <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-amber-800 cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <IoEyeOff/> : <IoEye/>}
                </span>
            </div>
            <button
                type="submit"
                className="mt-2 bg-amber-900 text-white font-semibold py-2 rounded-lg hover:bg-amber-800 transition"
                disabled={loading}
            >
                {loading ? "Signing In..." : "Sign In"}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
    );
}
