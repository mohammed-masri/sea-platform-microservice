import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';
import { LoginDto, MicrosoftLoginDto } from 'src/controllers/auth/auth.dto';
import { Utils } from 'sea-backend-helpers';
import { Constants, JWTConfig } from 'src/config';
import { LoginResponse } from './auth.dto';
import { AccountResponse } from '../account/account.dto';
import { Op } from 'sequelize';
import { MicrosoftAuthService } from '../microsoft-auth/microsoft-auth.service';
import { Account } from '../account/account.model';
import { ServerConfigService } from '../server-config/server-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
    private readonly microsoftAuthService: MicrosoftAuthService,
    private readonly serverConfigService: ServerConfigService,
  ) {}

  private async signToken(account: Account) {
    const JWT_SECRET = this.serverConfigService.get<string>('JWT_SECRET') || '';
    const token = this.jwtService.sign(
      { id: account.id, type: account.type },
      {
        secret: JWT_SECRET,
        ...JWTConfig.JWT_OPTIONS,
      },
    );

    return token;
  }

  async login(data: LoginDto) {
    const { email, phoneNumber, password } = data;

    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const account = await this.accountService.findOne({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    if (!account) throw new UnauthorizedException('Invalid credentials');

    const isCorrect = await Utils.Bcrypt.comparePassword(
      password,
      account?.password,
    );

    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    if (account.isLocked)
      throw new UnauthorizedException('The account has been locked!');

    const token = await this.signToken(account);

    return this.makeLoginResponse(
      token,
      this.accountService.makeAccountResponse(account),
    );
  }

  async microsoftLogin(data: MicrosoftLoginDto) {
    const { idToken } = data;

    const { email, name } =
      await this.microsoftAuthService.verifyIdToken(idToken);

    // create account if not exist
    let account = await this.accountService.findOne({
      where: { email },
    });

    if (!account) {
      // The account type will be User by default when login by microsoft

      account = await this.accountService.create({
        name,
        email,
        type: Constants.Account.AccountTypes.User,
      });
    }

    if (account.isLocked)
      throw new UnauthorizedException('The account has been locked!');

    const token = await this.signToken(account);

    return this.makeLoginResponse(
      token,
      this.accountService.makeAccountResponse(account),
    );
  }

  makeLoginResponse(accessToken: string, account: AccountResponse) {
    return new LoginResponse(accessToken, account);
  }
}
