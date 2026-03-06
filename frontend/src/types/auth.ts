export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    message?: string;
}
