import * as util from 'util';
import * as fs from 'fs';

export enum LogLevel {
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error',
}

export type LogLevelString = keyof typeof LogLevel;

export interface ILogger {
    debug(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    isDebugEnabled(): boolean;
}

const COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
};
const RESET = '\x1b[0m';

class Logger implements ILogger {
    private levelOrder: LogLevel[] = [LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error];
    private minLevel: LogLevel;
    private logToFile: boolean;
    private logFilePath: string;

    constructor(minLevel: LogLevel = LogLevel.error, logToFile = false, logFilePath = 'app.log') {
        this.minLevel = minLevel;
        this.logToFile = logToFile;
        this.logFilePath = logFilePath;
    }

    private shouldLog(level: LogLevel): boolean {
        return this.levelOrder.indexOf(level) >= this.levelOrder.indexOf(this.minLevel);
    }

    private format(level: LogLevel, message: any, ...args: any[]): string {
        const time = new Date().toISOString();
        const color = COLORS[level];
        const levelStr = level.toUpperCase().padEnd(5);
        const msg = util.format(message, ...args);
        return `${color}[${time}] [${levelStr}]${RESET} ${msg}`;
    }

    private write(level: LogLevel, message: any, ...args: any[]) {
        if (!this.shouldLog(level)) return;
        const formatted = this.format(level, message, ...args);
        // Print to console
        if (level === 'error') {
            console.error(formatted);
        } else if (level === 'warn') {
            console.warn(formatted);
        } else {
            console.log(formatted);
        }
        // Optionally write to file
        if (this.logToFile) {
            const plain = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${util.format(message, ...args)}\n`;
            fs.appendFile(this.logFilePath, plain, () => {});
        }
    }

    debug(message: any, ...args: any[]) {
        this.write(LogLevel.debug, message, ...args);
    }
    info(message: any, ...args: any[]) {
        this.write(LogLevel.info, message, ...args);
    }
    warn(message: any, ...args: any[]) {
        this.write(LogLevel.warn, message, ...args);
    }
    error(message: any, ...args: any[]) {
        this.write(LogLevel.error, message, ...args);
    }
    setLogLevel(level: LogLevel) {
        this.minLevel = level;
    }
    getLogLevel(): LogLevel {
        return this.minLevel;
    }
    isDebugEnabled(): boolean {
        return this.shouldLog(LogLevel.debug);
    }
}

let loggerInstance: Logger | null = null;

export function getLogger(level: LogLevel = LogLevel.error, logToFile: boolean = false, logFilePath: string = ""): Logger {
    if (!loggerInstance) {
        loggerInstance = new Logger(level, logToFile, logFilePath);
    }
    return loggerInstance;
}