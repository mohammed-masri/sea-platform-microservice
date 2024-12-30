import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from 'src/models/account/account.service';
import { accountProviders } from 'src/models/account/account.provider';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { RoleModuleDependencies } from 'src/modules/role.module';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    ...accountProviders,
    ...RoleModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class AccountControllerModule {}
