import { Link } from "react-router";

export default function HomePage() {
    return (
        <main>
            <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                        A little time for yourself
                    </p>

                    <h1 className="font-heading mt-5 text-5xl font-normal leading-tight text-gray-900 md:text-7xl">
                        Your next favourite set starts here.
                    </h1>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/book"
                            className="rounded-full bg-rose-800 px-7 py-3 font-semibold text-white transition hover:bg-rose-900"
                        >
                            Book an appointment
                        </Link>

                        <Link
                            to="/artist"
                            className="rounded-full border border-rose-800 px-7 py-3 font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                            Explore portfolio
                        </Link>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="about-heading"
                className="border-y border-rose-100 bg-white"
            >
                <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3 md:gap-12">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                            Get to know us
                        </p>

                        <h2
                            id="about-heading"
                            className="font-heading mt-3 text-4xl font-normal text-gray-900"
                        >
                            About NailHQ
                        </h2>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-lg leading-8 text-gray-600">
                            From bold, unexpected designs to soft, subtle sets,
                            NailHQ is all about nails that feel like you.
                            Whether you love intricate nail art, a little sparkle,
                            or a clean, understated finish, there’s room for every
                            style. Not sure what you want? We’ll explore ideas
                            together and help you choose a design you’ll love.
                        </p>
                    </div>
                </div>
            </section>

            <section
                id="reviews"
                aria-labelledby="reviews-heading"
                className="mx-auto max-w-6xl scroll-mt-8 px-5 py-14"
            >
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                    Client experiences
                </p>

                <h2
                    id="reviews-heading"
                    className="font-heading mt-3 text-4xl font-normal text-gray-900"
                >
                    A few words from you.
                </h2>

                <p className="mt-5 text-gray-600">
                    Client reviews will be available here soon.
                </p>
            </section>

            <section
                aria-labelledby="location-heading"
                className="border-t border-rose-100 bg-white"
            >
                <div className="mx-auto max-w-6xl px-5 py-14">
                    <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                        Find NailHQ
                    </p>

                    <h2
                        id="location-heading"
                        className="font-heading mt-3 text-4xl font-normal text-gray-900"
                    >
                        Your next set is closer than you think.
                    </h2>

                    <div className="mt-8 flex min-h-80 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
                        <p className="text-gray-600">
                            Location and map coming soon.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}