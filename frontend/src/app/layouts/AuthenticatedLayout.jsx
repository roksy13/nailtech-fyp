import { Outlet } from "react-router";
import LogoutButton from "../../features/auth/LogoutButton";

export default function AuthenticatedLayout() {
    return (
        <div className="min-h-screen bg-rose-50">
            <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4">
                <span className="text-xl font-bold text-rose-800">
                    NailHQ
                </span>

                <LogoutButton />
            </header>

            <main className="p-6 md:p-12">
                <Outlet />
            </main>
        </div>
    );
}