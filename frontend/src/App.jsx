import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./features/auth/useAuth";
import SessionGate from "./features/auth/SessionGate";
import RoleRoute from "./app/routes/RoleRoute";
import AuthenticatedLayout from "./app/layouts/AuthenticatedLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
    const { user, profile } = useAuth();

    const destination =
        profile?.role === "OWNER" ? "/dashboard" : "/home";

    return (
        <SessionGate>
            <Routes>
                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to={destination} replace />
                            : <LoginPage />
                    }
                />

                <Route element={<RoleRoute role="CLIENT" />}>
                    <Route element={<AuthenticatedLayout />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                </Route>

                <Route element={<RoleRoute role="OWNER" />}>
                    <Route element={<AuthenticatedLayout />}>
                        <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                        />
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={user ? destination : "/login"}
                            replace
                        />
                    }
                />
            </Routes>
        </SessionGate>
    );
}