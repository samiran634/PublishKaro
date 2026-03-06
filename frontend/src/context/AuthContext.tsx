import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginPayload, SignupPayload } from '../types/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    signup: (payload: SignupPayload) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session from cookie on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch {
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const persistUser = useCallback((newUser: User) => {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    }, []);

    const login = useCallback(
        async (payload: LoginPayload) => {
            const response = await authService.login(payload);
            if (response.success) {
                persistUser(response.user);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        },
        [persistUser]
    );

    const signup = useCallback(
        async (payload: SignupPayload) => {
            const response = await authService.signup(payload);
            if (response.success) {
                persistUser(response.user);
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        },
        [persistUser]
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Continue with local cleanup even if the API call fails
        }
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
