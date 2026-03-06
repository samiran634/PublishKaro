export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
}

export interface HealthCheckResponse {
    status: string;
    message: string;
    timestamp: string;
    environment: string;
}
