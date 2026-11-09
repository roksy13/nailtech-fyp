import { Link } from "react-router";

export default function ArtistPage() {
    return (
        <main className="mx-auto max-w-6xl px-5 py-16">
            <section className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                    Meet your artist
                </p>

                <h1 className="font-heading mt-4 text-5xl font-normal text-gray-900">
                    The artist behind your next set.
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                    Get to know the artist and explore their nail designs.
                    Artist information will be available here soon.
                </p>
            </section>

            <section className="mt-12">
                <h2 className="font-heading text-4xl font-normal text-gray-900">
                    Portfolio
                </h2>

                <div className="mt-6 rounded-2xl border border-dashed border-rose-300 bg-white p-10 text-center">
                    <p className="text-gray-600">
                        The portfolio is being prepared. Check back for
                        nail designs and recent work.
                    </p>
                </div>
            </section>

            <Link
                to="/book"
                className="mt-8 inline-block rounded-full bg-rose-800 px-7 py-3 font-semibold text-white"
            >
                Book an appointment
            </Link>
        </main>
    );
}