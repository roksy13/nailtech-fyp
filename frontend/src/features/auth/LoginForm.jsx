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
    
    function renderForm(registering) {
        const active = isRegistering === registering;
        const mode = registering ? "register" : "login";

        return (
            <form
                className={`nail-auth__form nail-auth__form--${mode} ${
                    active ? "is-active" : ""
                }`}
                onSubmit={handleSubmit}
                aria-hidden={!active}
                inert={!active}
                aria-busy={loading}
            >
                <fieldset disabled={loading || !active}>
                    <span className="nail-auth__eyebrow">NailHQ</span>

                    <h1 className="nail-auth__title">
                        {registering ? "Join the nail club." : "Welcome back."}
                    </h1>

                    <p className="nail-auth__description">
                        {registering
                            ? "Create your account and find your next favourite set."
                            : "Your next beautiful set starts here."}
                    </p>

                    <label htmlFor={`${mode}-email`}>Email address</label>
                    <input
                        id={`${mode}-email`}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor={`${mode}-password`}>Password</label>
                    <input
                        id={`${mode}-password`}
                        type="password"
                        autoComplete={
                            registering ? "new-password" : "current-password"
                        }
                        placeholder={
                            registering
                                ? "Create a password"
                                : "Enter your password"
                        }
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={registering ? 6 : undefined}
                        required
                    />

                    {registering && (
                        <>
                            <label htmlFor="register-confirm-password">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                required
                            />
                        </>
                    )}

                    {!registering && (
                        <button
                            type="button"
                            className="nail-auth__forgot"
                            onClick={handleResetPassword}
                        >
                            Forgot password?
                        </button>
                    )}

                    {active && error && (
                        <p className="nail-auth__error" role="alert">
                            {error}
                        </p>
                    )}

                    {active && message && (
                        <p className="nail-auth__message" role="status">
                            {message}
                        </p>
                    )}

                    <button type="submit" className="nail-auth__submit">
                        {loading
                            ? "Please wait..."
                            : registering
                                ? "Create account"
                                : "Sign in"}
                    </button>

                    <div className="nail-auth__divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="nail-auth__google"
                        onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </button>
                </fieldset>
            </form>
        );
    }

    function renderHero(registering) {
        const active = isRegistering === registering;
        const mode = registering ? "register" : "login";

        return (
            <aside
                className={`nail-auth__hero nail-auth__hero--${mode} ${
                    active ? "is-active" : ""
                }`}
                aria-hidden={!active}
                inert={!active}
            >
                <div>
                <span className="nail-auth__eyebrow">
                    A little self-care
                </span>

                    <h2>{registering ? "One of us?" : "New here?"}</h2>

                    <p>
                        {registering
                            ? "Sign in to manage your appointments and revisit your favourite designs."
                            : "Find your inspiration, save your favourites and make time for yourself."}
                    </p>

                    <button
                        type="button"
                        className="nail-auth__switch"
                        onClick={toggleMode}
                        disabled={loading || !active}
                    >
                        {registering ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </aside>
        );
    }
    return (
        <section
            className={`nail-auth ${
                isRegistering ? "nail-auth--register" : ""
            }`}
            aria-label="NailHQ account access"
        >
            <div
                className="nail-auth__background"
                aria-hidden="true"
            />

            {renderForm(false)}
            {renderForm(true)}

            {renderHero(false)}
            {renderHero(true)}
        </section>
    );
}