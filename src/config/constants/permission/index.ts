export type AdminPermissionKeys =
  | 'manage-accounts'
  | 'manage-accounts-read'
  | 'manage-accounts-create'
  | 'manage-accounts-change-password'
  | 'manage-accounts-update-details'
  | 'manage-roles'
  | 'manage-roles-read'
  | 'manage-roles-create'
  | 'manage-roles-update-details'
  | 'manage-roles-delete';

export type UserPermissionKeys = '';

export type PermissionKeys = AdminPermissionKeys | UserPermissionKeys;

export interface IPermission {
  name: string;
  key: PermissionKeys;
  children?: IPermission[] | undefined;
}

export const USER_PERMISSIONS: IPermission[] = [];

export const ADMIN_PERMISSIONS: IPermission[] = [
  {
    key: 'manage-accounts',
    name: 'Manage Account',
    children: [
      {
        key: 'manage-accounts-read',
        name: 'Read Accounts',
      },
      {
        key: 'manage-accounts-create',
        name: 'Create Account',
      },
      {
        key: 'manage-accounts-update-details',
        name: 'Update Account Details',
      },
      {
        key: 'manage-accounts-change-password',
        name: 'Change Account Password',
      },
    ],
  },
  {
    key: 'manage-roles',
    name: 'Manage Roles',
    children: [
      {
        key: 'manage-roles-read',
        name: 'Read Roles',
      },
      {
        key: 'manage-roles-create',
        name: 'Create Roles',
      },
      {
        key: 'manage-roles-update-details',
        name: 'Update Role Details',
      },
      {
        key: 'manage-roles-delete',
        name: 'Change Role Password',
      },
    ],
  },
];
