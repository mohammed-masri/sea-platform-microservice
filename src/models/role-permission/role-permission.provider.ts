import { Constants } from 'src/config';
import { RolePermission } from './role-permission.model';

export const rolePermissionProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.RolePermissionRepository,
    useValue: RolePermission,
  },
];
