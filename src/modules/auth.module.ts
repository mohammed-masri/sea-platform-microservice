import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/models/auth/auth.service';
import { AccountModuleDependencies } from './account.module';
import { MicrosoftAuthModuleDependencies } from './microsoft-auth.module';

export const AuthModuleDependencies = {
  imports: [],
  providers: [
    AuthService,
    JwtService,
    ...AccountModuleDependencies.providers,
    ...MicrosoftAuthModuleDependencies.providers,
  ],
};

@Module({
  imports: [...AuthModuleDependencies.imports],
  providers: [...AuthModuleDependencies.providers],
})
export class AuthModule {}
