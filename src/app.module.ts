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
import { AccountTypeModule } from './modules/account-type.module';
import { SeederControllerModule } from './controllers/seeder/seeder-controller.module';

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
    AccountTypeModule,
    SeederControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
