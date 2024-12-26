export enum AdminPermissionKeys {
  ManageAccounts = 'manage-accounts',
  ManageAccountsRead = 'manage-accounts-read',
  ManageAccountsCreate = 'manage-accounts-create',
  ManageAccountsChangePassword = 'manage-accounts-change-password',
  ManageAccountsUpdateDetails = 'manage-accounts-update-details',
  ManageRoles = 'manage-roles',
  ManageRolesRead = 'manage-roles-read',
  ManageRolesCreate = 'manage-roles-create',
  ManageRolesUpdateDetails = 'manage-roles-update-details',
  ManageRolesDelete = 'manage-roles-delete',
}
export enum UserPermissionKeys {}

export interface IPermission {
  name: string;
  key: AdminPermissionKeys | UserPermissionKeys;
  children?: IPermission[] | undefined;
}

export const USER_PERMISSIONS: IPermission[] = [];

export const ADMIN_PERMISSIONS: IPermission[] = [
  {
    key: AdminPermissionKeys.ManageAccounts,
    name: 'Manage Account',
    children: [
      {
        key: AdminPermissionKeys.ManageAccountsRead,
        name: 'Read Accounts',
      },
      {
        key: AdminPermissionKeys.ManageAccountsCreate,
        name: 'Create Account',
      },
      {
        key: AdminPermissionKeys.ManageAccountsUpdateDetails,
        name: 'Update Account Details',
      },
      {
        key: AdminPermissionKeys.ManageAccountsChangePassword,
        name: 'Change Account Password',
      },
    ],
  },
  {
    key: AdminPermissionKeys.ManageRoles,
    name: 'Manage Roles',
    children: [
      {
        key: AdminPermissionKeys.ManageRolesRead,
        name: 'Read Roles',
      },
      {
        key: AdminPermissionKeys.ManageRolesCreate,
        name: 'Create Roles',
      },
      {
        key: AdminPermissionKeys.ManageRolesUpdateDetails,
        name: 'Update Role Details',
      },
      {
        key: AdminPermissionKeys.ManageRolesDelete,
        name: 'Delete Role',
      },
    ],
  },
];

export const PERMISSIONS = [...USER_PERMISSIONS, ...ADMIN_PERMISSIONS];
