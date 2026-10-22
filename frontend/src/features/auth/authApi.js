import { auth } from "../../lib/firebase";

export async function ensureUserProfile(user = auth.currentUser) {
    if (!user) {
        throw new Error("Please sign in first.");
    }

    const token = await user.getIdToken();

    const response = await fetch("/api/me/profile", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(
            `Unable to initialise your profile (${response.status}).`
        );
    }

    return response.json();
}

export async function getOwnerDashboard() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Please sign in first.");
    }

    const token = await user.getIdToken();

    const response = await fetch("/api/owner/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(
            `Owner request failed (${response.status}).`
        );
    }

    return response.json();
}