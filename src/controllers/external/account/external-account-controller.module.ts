import { Module } from '@nestjs/common';

import { ExternalAccountController } from './external-account.controller';
import { AccountService } from 'src/models/account/account.service';
import { accountProviders } from 'src/models/account/account.provider';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { RoleModuleDependencies } from 'src/modules/role.module';

@Module({
  controllers: [ExternalAccountController],
  providers: [
    AccountService,
    ...accountProviders,
    ...RoleModuleDependencies.providers,
    ServerConfigService,
  ],
})
export class ExternalAccountControllerModule {}
