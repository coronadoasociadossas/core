import { Role } from "./role";

export interface RolePermission {
    module: string;
    permissions: string[]; // e.g., ["read", "write"]
}

export interface RolesPermissions {
    roleId: string;
    role?: Role;
    modules: string[]; // e.g., ["users", "sessions"]
    modPermissions: RolePermission[];
}
