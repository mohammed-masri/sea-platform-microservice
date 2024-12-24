import { Injectable } from '@nestjs/common';
import { SeedDate } from 'src/config';
import { AccountTypeService } from '../account-type/account-type.service';

@Injectable()
export class SeederService {
  constructor(private readonly accountTypeService: AccountTypeService) {}

  async seedAccountTypes() {
    for (let i = 0; i < SeedDate.ACCOUNT_TYPES.length; i++) {
      const at = SeedDate.ACCOUNT_TYPES[i];
      await this.accountTypeService.create(at);
    }
  }
}
