import { useState } from "react";
import {
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    resetPassword,
} from "./authService";
import "./LoginForm.css";

export default function LoginForm() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function toggleMode() {
        setIsRegistering((previous) => !previous);
        setPassword("");
        setConfirmPassword("");
        setError("");
        setMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (isRegistering && password !== confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            if (isRegistering) {
                await registerWithEmail(email.trim(), password);
            } else {
                await loginWithEmail(email.trim(), password);
            }
        } catch (error) {
            const messages = {
                "auth/email-already-in-use":
                    "Unable to register. Try signing in or resetting your password.",
                "auth/weak-password": "Please choose a stronger password.",
                "auth/password-does-not-meet-requirements":
                    "Your password does not meet the required password policy.",
                "auth/invalid-credential": "Incorrect email or password.",
                "auth/too-many-requests":
                    "Too many attempts. Please wait before trying again.",
                "auth/network-request-failed":
                    "Check your internet connection and try again.",
            };

            setError(
                messages[error.code] ?? "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await loginWithGoogle();
        } catch (error) {
            if (error.code !== "auth/popup-closed-by-user") {
                setError("Unable to sign in with Google. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword() {
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Enter your email address first.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(email.trim());
            setMessage(
                "If an account exists for that email, you’ll receive a reset link."
            );
        } catch {
            setError("Unable to request a password reset. Check the email address.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section
            className={`auth-card ${isRegistering ? "auth-card--register" : ""}`}
            aria-label="Account access"
        >
            <div className="auth-form-panel">
                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    aria-busy={loading}
                >
                    <span className="auth-eyebrow">NailHQ</span>

                    <h1>{isRegistering ? "Join the nail club." : "Welcome back."}</h1>

                    <p className="auth-description">
                        {isRegistering
                            ? "Create your account and find your next favourite set."
                            : "Your next beautiful set starts here."}
                    </p>

                    <label htmlFor="auth-email">Email address</label>
                    <input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={loading}
                        required
                    />

                    <label htmlFor="auth-password">Password</label>
                    <input
                        id="auth-password"
                        type="password"
                        autoComplete={
                            isRegistering ? "new-password" : "current-password"
                        }
                        placeholder={
                            isRegistering ? "Create a password" : "Enter your password"
                        }
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={isRegistering ? 6 : undefined}
                        disabled={loading}
                        required
                    />

                    {isRegistering && (
                        <>
                            <label htmlFor="auth-confirm-password">
                                Confirm password
                            </label>
                            <input
                                id="auth-confirm-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                disabled={loading}
                                required
                            />
                        </>
                    )}

                    {!isRegistering && (
                        <button
                            className="auth-forgot"
                            type="button"
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            Forgot password?
                        </button>
                    )}

                    {error && (
                        <p className="auth-feedback auth-feedback--error" role="alert">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="auth-feedback" role="status">
                            {message}
                        </p>
                    )}

                    <button
                        className="auth-primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegistering
                                ? "Create account"
                                : "Sign in"}
                    </button>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        className="auth-google"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        Continue with Google
                    </button>
                </form>
            </div>

            <aside className="auth-story-panel">
                <div className="auth-story-content">
                    <span className="auth-eyebrow">A LITTLE SELF-CARE</span>

                    <h2>
                        {isRegistering ? "Already one of us?" : "New here?"}
                    </h2>

                    <p>
                        {isRegistering
                            ? "Sign in to manage your appointments and revisit your favourite designs."
                            : "Find your inspiration, save your favourites and make time for yourself."}
                    </p>

                    <button
                        className="auth-switch"
                        type="button"
                        onClick={toggleMode}
                        disabled={loading}
                    >
                        {isRegistering ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </aside>
        </section>
    );
}