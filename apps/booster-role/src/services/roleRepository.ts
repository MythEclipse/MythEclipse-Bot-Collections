export type RoleRepository = {
  listRoles(): Promise<{ id: string; name: string }[]>;
  createRole(input: {
    name: string;
    color: string | null;
    colors?: {
      primaryColor: string;
      secondaryColor?: string;
      tertiaryColor?: string;
    } | null;
    permissions: string[];
    position: number;
  }): Promise<{ id: string }>;
  updateRole(
    roleId: string,
    input: {
      name?: string;
      color?: string | null;
      colors?: {
        primaryColor: string;
        secondaryColor?: string;
        tertiaryColor?: string;
      } | null;
      icon?: string | null;
    }
  ): Promise<void>;
  assignRole(userId: string, roleId: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
  deleteRole(roleId: string): Promise<void>;
};
