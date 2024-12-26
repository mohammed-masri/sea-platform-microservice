import { Constants } from 'src/config';
import { RolePermission } from './role-permission.model';

export const permissionProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.RolePermissionRepository,
    useValue: RolePermission,
  },
];
