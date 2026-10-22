import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/useAuth";

export default function RoleRoute({ role }) {
    const { user, profile } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const destination =
        profile?.role === "OWNER" ? "/dashboard" : "/home";

    if (profile?.role !== role) {
        return <Navigate to={destination} replace />;
    }

    return <Outlet />;
}