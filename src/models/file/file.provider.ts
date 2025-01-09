import { Constants } from 'src/config';
import { File } from './file.model';

export const fileProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.FileRepository,
    useValue: File,
  },
];
