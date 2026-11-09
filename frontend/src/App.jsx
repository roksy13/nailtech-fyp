import { Navigate, Route, Routes } from "react-router";
import PublicLayout from "./app/layouts/PublicLayout";
import AuthenticatedLayout from "./app/layouts/AuthenticatedLayout";
import RoleRoute from "./app/routes/RoleRoute";
import SessionGate from "./features/auth/SessionGate";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArtistPage from "./pages/ArtistPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/artist" element={<ArtistPage />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/home"
                    element={<Navigate to="/" replace />}
                />
            </Route>

            <Route
                element={
                    <SessionGate>
                        <RoleRoute role="OWNER" />
                    </SessionGate>
                }
            >
                <Route element={<AuthenticatedLayout />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}