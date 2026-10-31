export type BoosterRoleRecord = {
  guildId: string;
  userId: string;
  roleId: string;
  name: string;
  color: string | null;
  color2: string | null;
  icon: string | null;
  createdAt: number;
  updatedAt: number;
};

export type BoosterRoleUpdate = Partial<
  Pick<BoosterRoleRecord, "name" | "color" | "color2" | "icon" | "updatedAt">
>;

export type BoosterRoleStore = {
  findByUser(guildId: string, userId: string): Promise<BoosterRoleRecord | null>;
  findByGuild(guildId: string): Promise<BoosterRoleRecord[]>;
  create(record: BoosterRoleRecord): Promise<void>;
  update(guildId: string, userId: string, changes: BoosterRoleUpdate): Promise<void>;
  delete(guildId: string, userId: string): Promise<void>;
};
