import { useState } from "react";
import { logout } from "./authService";

export default function LogoutButton() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setError("");
        setLoading(true);

        try {
            await logout();
        } catch {
            setError("Unable to sign out. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="rounded-full bg-rose-800 px-6 py-3 text-white disabled:opacity-50"
            >
                {loading ? "Signing out..." : "Sign out"}
            </button>

            {error && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}