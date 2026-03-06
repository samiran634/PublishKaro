import api from './api';
import type { AuthResponse, LoginPayload, SignupPayload } from '../types/auth';
import type { HealthCheckResponse } from '../types/api';

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/signing/login', payload);
        return data;
    },

    async signup(payload: SignupPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/signing/signin', payload);
        return data;
    },

    async healthCheck(): Promise<HealthCheckResponse> {
        const { data } = await api.get<HealthCheckResponse>('/health');
        return data;
    },

    async logout(): Promise<void> {
        await api.post('/signing/logout');
    },
};
