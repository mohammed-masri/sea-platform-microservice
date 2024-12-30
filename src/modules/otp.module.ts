import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { otpProviders } from 'src/models/otp/otp.provider';
import { OTPService } from 'src/models/otp/otp.service';

export const OTPModuleDependencies = {
  imports: [DatabaseModule],
  providers: [OTPService, ...otpProviders],
};

@Module({
  imports: [...OTPModuleDependencies.imports],
  providers: [...OTPModuleDependencies.providers],
})
export class OTPModule {}
