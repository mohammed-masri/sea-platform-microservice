import { Constants } from 'src/config';
import { Role } from './role.model';

export const roleProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.RoleRepository,
    useValue: Role,
  },
];
