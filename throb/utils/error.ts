export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(400, message, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
        this.name = 'NotFoundError';
    }
}

export class InternalError extends AppError {
    constructor(message: string, details?: unknown) {
        super(500, message, details);
        this.name = 'InternalError';
    }
}

export function formatZodError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'issues' in error) {
        const issues = (error as { issues: Array<{ path: string[]; message: string }> })
            .issues;
        return issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    }
    return 'Validation failed';
}
