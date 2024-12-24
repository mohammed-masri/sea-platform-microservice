import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountTypeProviders } from 'src/models/account-type/account-type.provider';
import { AccountTypeService } from 'src/models/account-type/account-type.service';

export const AccountTypeModuleDependencies = {
  imports: [DatabaseModule],
  providers: [AccountTypeService, ...accountTypeProviders],
};

@Module({
  imports: [...AccountTypeModuleDependencies.imports],
  providers: [...AccountTypeModuleDependencies.providers],
})
export class AccountTypeModule {}
