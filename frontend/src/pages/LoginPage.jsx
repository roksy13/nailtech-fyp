import { Navigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/useAuth";
import LoginForm from "../features/auth/LoginForm";
import SessionGate from "../features/auth/SessionGate";

function SignedInRedirect() {
    const { profile } = useAuth();
    const location = useLocation();

    const destination =
        profile.role === "OWNER"
            ? "/dashboard"
            : location.state?.from === "/book"
                ? "/book"
                : "/";

    return <Navigate to={destination} replace />;
}

export default function LoginPage() {
    const { user, loading } = useAuth();

    if (loading || user) {
        return (
            <SessionGate>
                {user ? <SignedInRedirect /> : null}
            </SessionGate>
        );
    }

    return (
        <main className="auth-page auth-page--login">
            <LoginForm />
        </main>
    );
}