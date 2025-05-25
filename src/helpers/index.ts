import { getLogger } from "../services/logger.service";
import path from "path";

const logger = getLogger()


export function withTryCatchLogging<TArgs extends any[], TReturn>(
    func: (...args: TArgs) => TReturn,
    functionName: string = func.name || 'AnonymousFunction'
): (...args: TArgs) => Promise<TReturn | undefined> | (TReturn | undefined) {
    return (...args: TArgs): Promise<TReturn | undefined> | (TReturn | undefined) => {
        let filePath = 'unknown';
        let fileName = 'unknown';
        const isDebug = typeof logger.isDebugEnabled === 'function' && logger.isDebugEnabled();
        if (isDebug) {
            const stack = new Error().stack;
            if (stack) {
                const stackLines = stack.split('\n');
                const callerLine = stackLines[2] || '';
                const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
                if (match && match[1]) {
                    filePath = match[1];
                    fileName = path.basename(filePath);
                }
            }
            logger.debug(`[${functionName}] Entering function. [File: ${fileName}] [Path: ${filePath}]`)
        } else {
            logger.debug(`[${functionName}] Entering function.`)
        }
        try {
            const result = func(...args);
            if (result && typeof (result as any).then === 'function') {
                // Async function
                return (result as any)
                    .then((res: TReturn) => {
                        if (isDebug) {
                            logger.debug(`[${functionName}] Function executed successfully. [File: ${fileName}] [Path: ${filePath}]`)
                        } else {
                            logger.debug(`[${functionName}] Function executed successfully.`)
                        }
                        return res;
                    })
                    .catch((error: any) => {
                        if (isDebug) {
                            logger.error(`[${functionName}] An error occurred: [File: ${fileName}] [Path: ${filePath}]`, error);
                        } else {
                            logger.error(`[${functionName}] An error occurred:`, error);
                        }
                        return undefined;
                    });
            } else {
                // Sync function
                if (isDebug) {
                    logger.debug(`[${functionName}] Function executed successfully. [File: ${fileName}] [Path: ${filePath}]`)
                } else {
                    logger.debug(`[${functionName}] Function executed successfully.`)
                }
                return result;
            }
        } catch (error: any) {
            if (isDebug) {
                logger.error(`[${functionName}] An error occurred: [File: ${fileName}] [Path: ${filePath}]`, error);
            } else {
                logger.error(`[${functionName}] An error occurred:`, error);
            }
            return undefined;
        }
    };
}