import { Module } from '@nestjs/common';

import { ExternalAccountController } from './external-account.controller';
import { AccountService } from 'src/models/account/account.service';
import { accountProviders } from 'src/models/account/account.provider';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  controllers: [ExternalAccountController],
  providers: [AccountService, ...accountProviders, ServerConfigService],
})
export class ExternalAccountControllerModule {}
