import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './modules/account.module';
import { AccountControllerModule } from './controllers/account/account-controller.module';
import { AuthControllerModule } from './controllers/auth/auth-controller.module';
import { AuthModule } from './modules/auth.module';
import { OTPModule } from './modules/otp.module';
import { ConfigModule } from '@nestjs/config';
import { ServerConfigModule } from './modules/server-config.module';
import { MicrosoftAuthModule } from './modules/microsoft-auth.module';
import { ExternalAccountControllerModule } from './controllers/external/account/external-account-controller.module';
import { SeederControllerModule } from './controllers/seeder/seeder-controller.module';
import { PermissionModule } from './modules/permission.module';
import { StaticControllerModule } from './controllers/static/static.module';
import { RoleModule } from './modules/role.module';
import { RoleControllerModule } from './controllers/role/role-controller.module';
import { RolePermissionModule } from './modules/role-permission.module';
import { AccountPermissionModule } from './modules/account-permission.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServerConfigModule,
    AccountModule,
    AuthModule,
    MicrosoftAuthModule,
    OTPModule,
    AccountControllerModule,
    AuthControllerModule,
    ExternalAccountControllerModule,
    SeederControllerModule,
    PermissionModule,
    StaticControllerModule,
    RoleModule,
    RoleControllerModule,
    RolePermissionModule,
    AccountPermissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
