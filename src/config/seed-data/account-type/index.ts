import { AccountTypes } from 'src/config/constants/account';

export interface IAccountTypeSeed {
  name: string;
  key: AccountTypes;
}

export const ACCOUNT_TYPES: IAccountTypeSeed[] = [
  {
    key: AccountTypes.User,
    name: 'User',
  },
  {
    key: AccountTypes.Admin,
    name: 'Admin',
  },
];
