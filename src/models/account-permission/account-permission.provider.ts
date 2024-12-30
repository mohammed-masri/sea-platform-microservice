import { Constants } from 'src/config';
import { AccountPermission } from './account-permission.model';

export const accountPermissionProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.AccountPermissionRepository,
    useValue: AccountPermission,
  },
];
