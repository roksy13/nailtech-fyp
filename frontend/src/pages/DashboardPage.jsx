import { useState } from "react";
import { getOwnerDashboard } from "../features/auth/authApi";

export default function DashboardPage() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function checkOwnerAccess() {
        setLoading(true);
        setMessage("");

        try {
            const result = await getOwnerDashboard();
            setMessage(result.message);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                Business workspace
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-gray-900">
                Your dashboard
            </h1>

            <p className="mt-4 text-gray-600">
                Manage appointments, services and availability here.
            </p>

            <button
                type="button"
                onClick={checkOwnerAccess}
                disabled={loading}
                className="mt-6 rounded-full bg-rose-800 px-6 py-3 text-white disabled:opacity-50"
            >
                {loading ? "Checking..." : "Check owner API access"}
            </button>

            <p className="mt-4 text-gray-600" role="status">
                {message}
            </p>
        </section>
    );
}