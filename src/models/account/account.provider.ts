import { Constants } from 'src/config';
import { Account } from './account.model';

export const accountProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.AccountRepository,
    useValue: Account,
  },
];
