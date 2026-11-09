import { Outlet } from "react-router";
import PublicNavbar from "../../components/PublicNavbar";

/**
 * Displays protected pages using the shared NailHQ navigation.
 */
export default function AuthenticatedLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-rose-50">
            <PublicNavbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
                <Outlet />
            </main>

            <footer className="border-t border-rose-100 bg-white px-5 py-6">
                <p className="mx-auto max-w-6xl text-sm text-gray-500">
                    © {new Date().getFullYear()} NailHQ
                </p>
            </footer>
        </div>
    );
}