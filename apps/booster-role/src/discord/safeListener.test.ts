import { Client, GatewayIntentBits } from "discord.js";
import { describe, test } from "node:test";
import { expect } from "expect";
import { errorDetails, installProcessSafetyNet, safeListener } from "./safeListener";

/**
 * discord.js types `emit`/`on` against `ClientEvents`, which is stricter than
 * what these tests need (they only exercise the rejection plumbing). This narrow
 * view keeps the real Client — and therefore the real `captureRejections`
 * behaviour — while letting a stub payload stand in for an interaction.
 */
type LooseClient = {
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  emit(event: string, ...args: unknown[]): boolean;
};

function looseClient(): LooseClient {
  return new Client({ intents: [GatewayIntentBits.Guilds] }) as unknown as LooseClient;
}

describe("safeListener", () => {
  test("reports a synchronous throw instead of propagating it", () => {
    const reported: Array<{ context: string; error: unknown }> = [];
    const listener = safeListener("sync", () => {
      throw new Error("boom");
    }, (context, error) => reported.push({ context, error }));

    expect(() => listener()).not.toThrow();
    expect(reported).toHaveLength(1);
    expect(reported[0].context).toBe("sync");
    expect((reported[0].error as Error).message).toBe("boom");
  });

  test("reports a rejected promise instead of letting it escape", async () => {
    const reported: Array<{ context: string; error: unknown }> = [];
    const listener = safeListener("async", async () => {
      throw new Error("getaddrinfo EAI_AGAIN discord.com");
    }, (context, error) => reported.push({ context, error }));

    // The wrapper returns undefined, so discord.js has no promise to capture.
    const returned = listener();
    expect(returned).toBeUndefined();

    await new Promise((resolve) => setImmediate(resolve));

    expect(reported).toHaveLength(1);
    expect((reported[0].error as Error).message).toContain("EAI_AGAIN");
  });

  test("does not report a listener that resolves", async () => {
    const reported: unknown[] = [];
    const listener = safeListener("ok", async () => "done", (_context, error) => reported.push(error));

    listener();
    await new Promise((resolve) => setImmediate(resolve));

    expect(reported).toEqual([]);
  });

  test("survives a reporter that itself throws", async () => {
    const listener = safeListener("bad reporter", async () => {
      throw new Error("first");
    }, () => {
      throw new Error("reporter failed");
    });

    expect(() => listener()).not.toThrow();
    await new Promise((resolve) => setImmediate(resolve));
  });

  /**
   * The regression that took the production unit down: discord.js builds its
   * Client with `captureRejections: true`, so an escaping rejection is re-emitted
   * as `error` — fatal when nothing listens. This asserts the wrapper keeps a
   * rejecting listener from ever reaching that path.
   */
  test("keeps a rejecting listener from emitting a fatal 'error' on a real client", async () => {
    const client = looseClient();
    const clientErrors: unknown[] = [];
    client.on("error", (error) => clientErrors.push(error));

    client.on("interactionCreate", safeListener("interactionCreate", async () => {
      throw new Error("getaddrinfo EAI_AGAIN discord.com");
    }, () => {}));

    client.emit("interactionCreate", {});
    await new Promise((resolve) => setImmediate(resolve));

    expect(clientErrors).toEqual([]);
  });

  test("documents that an unwrapped rejecting listener would emit 'error'", async () => {
    const client = looseClient();
    const clientErrors: unknown[] = [];
    // Listener attached on purpose: without it this emit would kill the process,
    // which is exactly the failure being guarded against.
    client.on("error", (error) => clientErrors.push(error));

    client.on("interactionCreate", async () => {
      throw new Error("getaddrinfo EAI_AGAIN discord.com");
    });

    client.emit("interactionCreate", {});
    await new Promise((resolve) => setImmediate(resolve));

    expect(clientErrors).toHaveLength(1);
  });
});

describe("errorDetails", () => {
  test("keeps the name, message and stack of an Error", () => {
    const details = errorDetails(new TypeError("bad"));

    expect(details.message).toBe("TypeError: bad");
    expect(details.stack).toContain("TypeError: bad");
  });

  test("stringifies non-Error rejections", () => {
    expect(errorDetails("plain string")).toEqual({ message: "plain string" });
    expect(errorDetails(undefined)).toEqual({ message: "undefined" });
  });
});

describe("installProcessSafetyNet", () => {
  test("logs an unhandled rejection and an uncaught exception, exiting on the latter", () => {
    const listeners = new Map<string, (value: unknown) => void>();
    const exitCodes: number[] = [];

    installProcessSafetyNet({
      exit: (code: number) => {
        exitCodes.push(code);
        return undefined as never;
      },
      target: {
        on(event: string, listener: (value: unknown) => void) {
          listeners.set(event, listener);
          return undefined;
        },
      },
    });

    expect([...listeners.keys()]).toEqual(["unhandledRejection", "uncaughtException"]);

    // A rejection is survived: no exit.
    listeners.get("unhandledRejection")?.(new Error("transient"));
    expect(exitCodes).toEqual([]);

    // An unexpected throw is not survived: exit so systemd can restart cleanly.
    listeners.get("uncaughtException")?.(new Error("fatal"));
    expect(exitCodes).toEqual([1]);
  });
});
