import SigninForm from "@/components/SigninForm";

export default function Signin() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col gap-6 items-center w-full md:max-w-md h-screen md:h-full backdrop-blur-md border border-neutral-500 md:rounded-2xl p-10 shadow-2xl bg-black/60">
                <h1 className="text-3xl font-bold text-amber-900 w-full text-center mb-2">
                    Welcome Back
                </h1>
                <p className="text-gray-100 text-center mb-4">
                    Sign in to continue to your account!
                </p>
                <SigninForm />
                <p className="text-gray-600 text-sm mt-4">
                    Don't have an account?{" "}
                    <a
                        href="/auth/signup"
                        className="text-amber-900 font-semibold hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
