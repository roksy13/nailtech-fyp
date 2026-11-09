import { Link } from "react-router";

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-4xl px-5 py-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                About NailHQ
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-gray-900">
                Nail appointments, made personal.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
                NailHQ brings inspiration and appointment management
                together in one place. Browse the portfolio, get to know
                your nail artist, and plan your next appointment.
            </p>

            <section className="mt-10 rounded-2xl bg-white p-8">
                <h2 className="text-2xl font-semibold">
                    How booking works
                </h2>

                <ol className="mt-5 list-decimal space-y-4 pl-5 text-gray-600">
                    <li>Sign in or create your account.</li>
                    <li>Choose a service and an available appointment time.</li>
                    <li>Submit your request for the nail artist’s approval.</li>
                    <li>
                        Your requested time is reserved while you wait.
                        Your booking is confirmed once the artist approves it.
                    </li>
                </ol>
            </section>

            <Link
                to="/artist"
                className="mt-8 inline-block font-semibold text-rose-800 underline"
            >
                Meet your nail artist
            </Link>
        </main>
    );
}