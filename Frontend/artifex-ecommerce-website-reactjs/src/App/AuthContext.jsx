import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../api";
import toast from "react-hot-toast";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount — check if there is an active Django session
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const { getProfile } = await import("../api");
                // NOTE: /api/auth/profile/ returns the user object directly,
                // e.g. { id, username, email, role, ... }
                const profile = await getProfile();
                if (profile && profile.username) {
                    setUser(profile);
                }
            } catch (err) {
                // No active session — this is fine
                console.log("No active session");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);


    const login = async (username, password) => {
        const data = await loginUser(username, password);
        // Backend returns { message, user: {...} }
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.username}! 👋`);
        return data;
    };


    const register = async (username, email, password) => {
        const data = await registerUser(username, email, password);
        toast.success("Account created! Please log in.");
        return data;
    };


    const logout = async () => {
        try {
            await logoutUser(); // Invalidate the Django session on the server
        } catch (err) {
            // Even if server logout fails, clear client state
            console.warn("Server logout failed:", err.message);
        }
        setUser(null);
        toast.success("Logged out successfully.");
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
