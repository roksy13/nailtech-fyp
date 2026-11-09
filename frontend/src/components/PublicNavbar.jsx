import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../features/auth/useAuth";
import LogoutButton from "../features/auth/LogoutButton";
import "./PublicNavbar.css";

const links = [
    { to: "/", label: "Home" },
    { to: "/artist", label: "Portfolio" },
    { to: "/book", label: "Book Appointment" },
];
/**
 * Displays public navigation and account actions.
 * Owners can enter their dashboard without changing account roles.
 */
export default function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, profile, loading } = useAuth();
    const { pathname } = useLocation();
    const isLoginPage = pathname === "/login";

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <header className="public-header">
            <div
                className="public-navbar"
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        closeMenu();
                    }
                }}
            >
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="public-navbar__logo font-heading"
                    aria-label="NailHQ home"
                >
                    NailHQ
                </NavLink>

                <button
                    type="button"
                    className="public-navbar__toggle"
                    aria-expanded={menuOpen}
                    aria-controls="public-navbar-panel"
                    onClick={() => setMenuOpen((previous) => !previous)}
                >
                    {menuOpen ? "Close" : "Menu"}
                </button>

                <div
                    id="public-navbar-panel"
                    className={`public-navbar__panel ${
                        menuOpen ? "public-navbar__panel--open" : ""
                    }`}
                >
                    <nav
                        aria-label="Main navigation"
                        className="public-navbar__links"
                    >
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `public-navbar__link ${
                                        isActive
                                            ? "public-navbar__link--active"
                                            : ""
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="public-navbar__account">
                        {loading ? (
                            <span role="status" className="text-sm text-gray-500">
                                Loading account…
                            </span>
                        ) : user ? (
                            <>
                                {profile?.role === "OWNER" && (
                                    <NavLink
                                        to="/dashboard"
                                        onClick={closeMenu}
                                        className="public-navbar__dashboard"
                                    >
                                        Dashboard
                                    </NavLink>
                                )}

                                <LogoutButton />
                            </>
                        ) : !isLoginPage ? (
                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                                className="public-navbar__signin"
                            >
                                Sign in
                            </NavLink>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
}