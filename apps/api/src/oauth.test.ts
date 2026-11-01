import { describe, test } from "node:test";
import { expect } from "expect";
import { authorizeUrl, canManageGuild, findManageableGuild } from "./oauth";

describe("authorizeUrl", () => {
  test("carries the client, redirect, scope and state", () => {
    const url = new URL(authorizeUrl({ clientId: "id", redirectUri: "https://x/cb", state: "s1" }));
    expect(url.origin).toBe("https://discord.com");
    expect(url.searchParams.get("client_id")).toBe("id");
    expect(url.searchParams.get("redirect_uri")).toBe("https://x/cb");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("identify guilds");
    expect(url.searchParams.get("state")).toBe("s1");
  });
});

describe("guild permission checks", () => {
  test("accepts administrator and manage-guild bits", () => {
    expect(canManageGuild("8")).toBe(true);
    expect(canManageGuild("32")).toBe(true);
    expect(canManageGuild(String(8 + 32 + 1024))).toBe(true);
  });

  test("rejects ordinary members and garbage", () => {
    expect(canManageGuild("0")).toBe(false);
    expect(canManageGuild("1024")).toBe(false);
    expect(canManageGuild("not-a-number")).toBe(false);
  });

  test("only returns the configured guild when the user can manage it", () => {
    const guilds = [
      { id: "guild-1", name: "A", permissions: "8" },
      { id: "guild-2", name: "B", permissions: "0" }
    ];
    expect(findManageableGuild(guilds, "guild-1")?.name).toBe("A");
    expect(findManageableGuild(guilds, "guild-2")).toBeNull();
    expect(findManageableGuild(guilds, "guild-3")).toBeNull();
  });
});
