enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    meta?: unknown;
}

function formatLogEntry(entry: LogEntry): string {
    const metaStr = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
    return `[${entry.timestamp}] ${entry.level}: ${entry.message}${metaStr}`;
}

function log(level: LogLevel, message: string, meta?: unknown): void {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        meta,
    };

    const formatted = formatLogEntry(entry);

    switch (level) {
        case LogLevel.ERROR:
            console.error(formatted);
            break;
        case LogLevel.WARN:
            console.warn(formatted);
            break;
        case LogLevel.DEBUG:
            console.debug(formatted);
            break;
        default:
            console.log(formatted);
    }
}

export const logger = {
    info: (message: string, meta?: unknown): void => log(LogLevel.INFO, message, meta),
    warn: (message: string, meta?: unknown): void => log(LogLevel.WARN, message, meta),
    error: (message: string, meta?: unknown): void => log(LogLevel.ERROR, message, meta),
    debug: (message: string, meta?: unknown): void => log(LogLevel.DEBUG, message, meta),
};
