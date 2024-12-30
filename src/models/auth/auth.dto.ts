import { ApiProperty } from '@nestjs/swagger';
import { AccountFullResponse } from '../account/account.dto';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty({ type: AccountFullResponse })
  account: AccountFullResponse;

  constructor(accessToken: string, account: AccountFullResponse) {
    this.accessToken = accessToken;
    this.account = account;
  }
}
