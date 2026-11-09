import { Outlet, useLocation } from "react-router";
import PublicNavbar from "../../components/PublicNavbar";

export default function PublicLayout() {

    const { pathname } = useLocation();
    const isLoginPage = pathname === "/login";

    return (
        <div className="flex min-h-screen flex-col bg-rose-50">
            <PublicNavbar />

            <div className="flex-1">
                <Outlet />
            </div>

            {!isLoginPage && (
                <footer className="border-t border-rose-100 bg-white px-5 py-6">
                    <p className="mx-auto max-w-6xl text-sm text-gray-500">
                        © {new Date().getFullYear()} NailHQ
                    </p>
                </footer>
            )}
        </div>
    );
}