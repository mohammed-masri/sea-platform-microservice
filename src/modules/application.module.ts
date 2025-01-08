import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { applicationProviders } from 'src/models/application/application.provider';
import { ApplicationService } from 'src/models/application/application.service';

export const ApplicationModuleDependencies = {
  imports: [DatabaseModule],
  providers: [ApplicationService, ...applicationProviders],
};

@Module({
  imports: [...ApplicationModuleDependencies.imports],
  providers: [...ApplicationModuleDependencies.providers],
})
export class ApplicationModule {}
