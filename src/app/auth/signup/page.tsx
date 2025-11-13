import SignupForm from "@/components/SignupForm";

export default function Signup() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col gap-6 items-center w-full md:max-w-md h-screen md:h-full backdrop-blur-md border border-neutral-500 md:rounded-2xl p-10 shadow-2xl bg-black/60">
                <h1 className="text-3xl text-yellow-50 font-bold w-full text-center mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-300 text-center mb-4">
                    Join our community and connect with friends!
                </p>
                <SignupForm />
                <p className="text-gray-300 text-2sm mt-4">
                    Already have an account?{" "}
                    <a
                        href="/auth/signin"
                        className="text-amber-900 font-semibold hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
