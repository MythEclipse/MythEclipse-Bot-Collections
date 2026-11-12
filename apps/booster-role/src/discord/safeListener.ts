import { logger } from "../logger";

/**
 * Why this module exists
 * ----------------------
 * discord.js constructs its `Client` with `captureRejections: true`. That means
 * a rejection escaping any event listener is re-emitted as an `error` event on
 * the client, and an `error` event with no listener is fatal in Node:
 *
 *     node:events:505  throw er; // Unhandled 'error' event
 *     Error: getaddrinfo EAI_AGAIN discord.com
 *     Emitted 'error' event on Client instance at: emitUnhandledRejectionOrErr
 *
 * That is exactly how the production unit died: a transient DNS failure inside a
 * listener took down the whole process, systemd restarted it, the network was
 * still down, and the bot crash-looped. A single failed interaction must never
 * be able to kill a bot that is otherwise healthy.
 *
 * The wrapper therefore returns a listener that is SYNCHRONOUS: it can neither
 * throw nor return a promise, so nothing is left for `captureRejections` to
 * capture. The reporter is itself guarded — a throwing logger must not become
 * the next unhandled rejection.
 */

export type ErrorReporter = (context: string, error: unknown) => void;

export function errorDetails(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: `${error.name}: ${error.message}`, stack: error.stack };
  }
  return { message: String(error) };
}

const logError: ErrorReporter = (context, error) => {
  const details = errorDetails(error);
  logger.error(context, details);
};

/**
 * Wraps an event listener so that a rejection is logged instead of crashing the
 * process. `context` names the listener in the log line, because "something
 * threw somewhere" is not debuggable from a journal alone.
 */
export function safeListener<Args extends unknown[]>(
  context: string,
  listener: (...args: Args) => unknown,
  report: ErrorReporter = logError,
): (...args: Args) => void {
  const reportSafely = (error: unknown): void => {
    try {
      report(context, error);
    } catch {
      // A failing reporter must not become an unhandled rejection itself.
    }
  };

  return (...args: Args): void => {
    try {
      const result = listener(...args) as unknown;

      if (result instanceof Promise) {
        void result.then(undefined, reportSafely);
      }
    } catch (error) {
      reportSafely(error);
    }
  };
}

/**
 * Installs the last-resort handlers. `unhandledRejection` is logged and survived:
 * Discord traffic produces transient REST/gateway rejections routinely, and a
 * dead bot cannot serve anyone. `uncaughtException` is logged and then exits,
 * because after a truly unexpected throw the process state is no longer
 * trustworthy and systemd is better placed to restart it cleanly.
 *
 * `target` and `exit` are injectable so the behaviour can be tested without
 * killing the test runner.
 */
export function installProcessSafetyNet(options: {
  exit?: (code: number) => never;
  target?: { on(event: string, listener: (value: unknown) => void): unknown };
} = {}): void {
  const exit = options.exit ?? ((code: number): never => process.exit(code));
  const target = options.target ?? process;

  target.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection (survived)", errorDetails(reason));
  });

  target.on("uncaughtException", (error) => {
    logger.error("Uncaught exception, exiting for a clean restart", errorDetails(error));
    try {
      exit(1);
    } catch {
      // Already exiting.
    }
  });
}
