import { useAuth } from "../features/auth/useAuth";

export default function HomePage() {
    const { profile } = useAuth();

    return (
        <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                Your NailTech
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-gray-900">
                Welcome{profile.displayName ? `, ${profile.displayName}` : ""}.
            </h1>

            <p className="mt-4 text-gray-600">
                Discover your next nail design and plan your next appointment.
            </p>
        </section>
    );
}