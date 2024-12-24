import { Constants } from 'src/config';
import { AccountType } from './account-type.model';

export const accountTypeProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.AccountTypeRepository,
    useValue: AccountType,
  },
];
