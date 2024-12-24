import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.model';
import { Constants } from 'src/config';
import { Utils } from 'sea-backend-helpers';

export class AccountResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  type: Constants.Account.AccountTypes;
  @ApiProperty()
  birthDate: string;
  @ApiProperty({ type: Boolean })
  isLocked: boolean;

  constructor(account: Account) {
    this.id = account.id;
    this.name = account.name;
    this.email = account.email;
    this.phoneNumber = account.phoneNumber;
    this.type = account.type;
    this.birthDate = null;
    if (account.birthDate) {
      this.birthDate = Utils.Moment.formatData(account.birthDate, 'YYYY-MM-DD');
    }

    this.isLocked = account.isLocked;
  }
}
