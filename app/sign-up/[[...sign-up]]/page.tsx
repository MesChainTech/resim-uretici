import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AI Product Generator
                    </h1>
                    <h2 className="text-xl text-gray-600">
                        Create your account
                    </h2>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <SignUp
                        afterSignUpUrl="/generate"
                        signInUrl="/sign-in"
                    />
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a
                        href="/sign-in"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Sign Up - AI Product Generator',
    description: 'Create an account to use the AI Product Generator',
};