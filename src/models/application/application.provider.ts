import { Constants } from 'src/config';
import { Application } from './application.model';

export const applicationProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ApplicationRepository,
    useValue: Application,
  },
];
