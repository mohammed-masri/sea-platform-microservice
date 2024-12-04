import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ChangeMyPasswordDto,
  LoginDto,
  RequestOTPDto,
  CheckOTPValidityDto,
  ResetPasswordDto,
  UpdateMyAccountDto,
  MicrosoftLoginDto,
} from './auth.dto';
import { AuthService } from 'src/models/auth/auth.service';
import { LoginResponse } from 'src/models/auth/auth.dto';
import { AccountResponse } from 'src/models/account/account.dto';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { AccountService } from 'src/models/account/account.service';
import { OTPService } from 'src/models/otp/otp.service';
import { Op } from 'sequelize';
import { AuthorizedRequest } from 'src/common/global.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly OTPService: OTPService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Account login with email or phone number' })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('/microsoft/login')
  @ApiOperation({ summary: 'Account login with microsoft account' })
  @ApiOkResponse({
    description: 'The account has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'The Id Token is invalid' })
  async microsoftLoginAccount(@Body() body: MicrosoftLoginDto) {
    return this.authService.microsoftLogin(body);
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'fetch logged account details' })
  @ApiOkResponse({
    description: 'the logged account details has been fetched',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchLoggedAccountDetails(@Request() req: AuthorizedRequest) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });
    return this.accountService.makeAccountResponse(account);
  }

  @Put('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'update my account details' })
  @ApiOkResponse({
    description: 'my account details has been updated',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async updateLoggedAccountDetails(
    @Request() req: AuthorizedRequest,
    @Body() body: UpdateMyAccountDto,
  ) {
    const accountId = req.context.id;
    let account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });
    account = await this.accountService.update(account, body);
    return this.accountService.makeAccountResponse(account);
  }

  @Put('change-password')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'change my password' })
  @ApiOkResponse({
    description: 'the password has been changed successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Old password is incorrect.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async changeMyPassword(
    @Request() req: AuthorizedRequest,
    @Body() body: ChangeMyPasswordDto,
  ) {
    const accountId = req.context.id;
    const account = await this.accountService.checkIsFound({
      where: { id: accountId },
    });

    return await this.accountService.changePassword(
      account,
      body.newPassword,
      true,
      body.oldPassword,
    );
  }

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for identifier' })
  @ApiOkResponse({ description: 'OTP sent successfully', type: Boolean })
  async requestOTP(@Body() body: RequestOTPDto) {
    const { email, phoneNumber } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    await this.OTPService.createOrUpdate(identifier);

    return true;
  }

  @Post('check-otp-validity')
  @ApiOperation({ summary: 'Verify OTP for identifier' })
  @ApiOkResponse({ description: 'OTP verified successfully', type: Boolean })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async checkOTPValidity(@Body() body: CheckOTPValidityDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    await this.OTPService.checkValidity(identifier, OTPCode);

    return true;
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'password has reset successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const otp = await this.OTPService.checkValidity(identifier, OTPCode);
    otp.destroy();

    const account = await this.accountService.checkIsFound({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    await this.accountService.changePassword(account, body.newPassword);

    return true;
  }
}
