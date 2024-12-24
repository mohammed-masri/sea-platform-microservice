import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SeederService } from 'src/models/seeder/seeder.service';
import { AccountTypeModuleDependencies } from './account-type.module';

export const SeederModuleDependencies = {
  imports: [DatabaseModule],
  providers: [SeederService, ...AccountTypeModuleDependencies.providers],
};

@Module({
  imports: [...SeederModuleDependencies.imports],
  providers: [...SeederModuleDependencies.providers],
})
export class SeederModule {}
