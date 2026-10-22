import { useAuth } from "./useAuth";
import LogoutButton from "./LogoutButton";

export default function SessionGate({ children }) {
    const { user, profile, loading, error, retryProfile } = useAuth();

    if (loading) {
        return (
            <main className="auth-page">
                <p role="status">Loading your account...</p>
            </main>
        );
    }

    const unsupportedRole =
        user && profile &&
        !["CLIENT", "OWNER"].includes(profile.role);

    if (error || (user && !profile) || unsupportedRole) {
        return (
            <main className="auth-page">
                <section className="max-w-md rounded-3xl bg-white p-10">
                    <h1 className="text-2xl font-semibold">
                        Unable to open your account
                    </h1>

                    <p role="alert" className="mt-4">
                        {error ?? "Your account profile or role is unavailable."}
                    </p>

                    <button
                        type="button"
                        onClick={retryProfile}
                        className="my-6 block text-rose-800 underline"
                    >
                        Try again
                    </button>

                    {user && <LogoutButton />}
                </section>
            </main>
        );
    }

    return children;
}