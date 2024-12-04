import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from 'src/models/account/account.service';
import { accountProviders } from 'src/models/account/account.provider';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    ...accountProviders,
    JwtService,
    ServerConfigService,
  ],
})
export class AccountControllerModule {}
