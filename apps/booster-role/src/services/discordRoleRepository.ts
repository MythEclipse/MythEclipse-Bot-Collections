import type { ColorResolvable, Guild, Role, RoleColorsResolvable } from "discord.js";
import type { RoleRepository } from "./roleRepository";

export type { RoleRepository } from "./roleRepository";

export class DiscordRoleRepository implements RoleRepository {
  constructor(private readonly guild: Guild) {}

  async listRoles() {
    await this.guild.roles.fetch();
    return this.guild.roles.cache.map((role) => ({ id: role.id, name: role.name }));
  }

  async createRole(input: { name: string; color: string | null; colors?: { primaryColor: string; secondaryColor?: string; tertiaryColor?: string } | null; permissions: string[]; position: number }): Promise<{ id: string }> {
    const colors = input.colors ?? (input.color ? { primaryColor: input.color as ColorResolvable } : undefined);
    const role = await this.guild.roles.create({
      name: input.name,
      colors: colors as RoleColorsResolvable | undefined,
      permissions: 0n
    });

    await role.setPosition(await this.resolvePosition(input.position));
    return { id: role.id };
  }

  async updateRole(roleId: string, input: { name?: string; color?: string | null; colors?: { primaryColor: string; secondaryColor?: string; tertiaryColor?: string } | null; icon?: string | null }): Promise<void> {
    const role = await this.fetchRole(roleId);
    await role.edit({
      name: input.name,
      colors: input.colors === undefined ? undefined : input.colors as RoleColorsResolvable,
      icon: input.icon === undefined ? undefined : input.icon
    });
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    const member = await this.guild.members.fetch(userId);
    await member.roles.add(roleId);
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const member = await this.guild.members.fetch(userId);
    await member.roles.remove(roleId);
  }

  /**
   * Deletes the role if Discord still has it. A role that is already gone counts
   * as success — the caller's intent ("this role should not exist") is satisfied.
   *
   * WHY THIS DOES NOT THROW: the only production caller is
   * `removeRoleForLostBoost`, which runs on every `guildMemberUpdate` and then
   * deletes the database row. When a role had been removed by hand, this threw
   * `Discord role not found`, the row survived, and the next member update threw
   * again — an error every few minutes, forever, for a role nobody could delete.
   * Treating "already absent" as done lets the caller finish and clean up.
   */
  async deleteRole(roleId: string): Promise<void> {
    const role = await this.fetchRole(roleId);
    if (!role) return;
    await role.delete();
  }

  private async resolvePosition(fallbackPosition: number): Promise<number> {
    return Math.max(fallbackPosition, 1);
  }

  private async fetchRole(roleId: string): Promise<Role | null> {
    return this.guild.roles.fetch(roleId);
  }
}
