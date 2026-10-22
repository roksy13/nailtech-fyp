import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { AuthContext } from "../../features/auth/AuthContext";
import { ensureUserProfile } from "../../features/auth/authApi";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let active = true;
        let requestVersion = 0;

        const unsubscribe = onAuthStateChanged(
            auth,
            (firebaseUser) => {
                const currentVersion = ++requestVersion;

                setUser(firebaseUser);
                setProfile(null);
                setError(null);

                if (!firebaseUser) {
                    setLoading(false);
                    return;
                }

                setLoading(true);

                ensureUserProfile(firebaseUser)
                    .then((loadedProfile) => {
                        if (active && currentVersion === requestVersion) {
                            setProfile(loadedProfile);
                        }
                    })
                    .catch(() => {
                        if (active && currentVersion === requestVersion) {
                            setError(
                                "You are signed in, but we could not load your profile. Check your connection and try again."
                            );
                        }
                    })
                    .finally(() => {
                        if (active && currentVersion === requestVersion) {
                            setLoading(false);
                        }
                    });
            },
            () => {
                requestVersion += 1;
                setUser(null);
                setProfile(null);
                setError("Unable to check your sign-in status.");
                setLoading(false);
            }
        );

        return () => {
            active = false;
            requestVersion += 1;
            unsubscribe();
        };
    }, [retryCount]);

    function retryProfile() {
        setLoading(true);
        setError(null);
        setRetryCount((previous) => previous + 1);
    }

    return (
        <AuthContext.Provider
            value={{ user, profile, loading, error, retryProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}