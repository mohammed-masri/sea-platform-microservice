import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from './account-type.model';

export class AccountTypeResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: string;

  constructor(accountType: AccountType) {
    this.id = accountType.id;
    this.name = accountType.name;
    this.key = accountType.key;
  }
}
