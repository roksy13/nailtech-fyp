import { Link } from "react-router";
import { useAuth } from "../features/auth/useAuth";
import SessionGate from "../features/auth/SessionGate";

function BookingContent() {
    return (
        <section className="rounded-2xl bg-white p-8">
            <h1 className="font-heading text-4xl text-gray-900">
                Book your appointment
            </h1>

            <p className="mt-4 text-gray-600">
                You’re signed in. Online booking will be available
                once services and appointment availability are added.
            </p>
        </section>
    );
}


export default function BookingPage() {
    const { user, loading } = useAuth();

    return (
        <main className="mx-auto max-w-3xl px-5 py-16">
            {loading || user ? (
                <SessionGate>
                    <BookingContent />
                </SessionGate>
            ) : (
                <section className="rounded-2xl bg-white p-8 text-center">
                    <h1 className="text-3xl font-semibold">
                        Log in to book
                    </h1>

                    <p className="mt-4 text-gray-600">
                        Sign in or create an account to request an
                        appointment and manage your bookings.
                    </p>

                    <Link
                        to="/login"
                        state={{ from: "/book" }}
                        className="mt-7 inline-block rounded-full bg-rose-800 px-7 py-3 font-semibold text-white"
                    >
                        Log in to book
                    </Link>
                </section>
            )}
        </main>
    );
}