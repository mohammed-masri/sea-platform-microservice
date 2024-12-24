import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { Attributes, FindOptions } from 'sequelize';
import { AccountType } from './account-type.model';
import { AccountTypeResponse } from './account-type.dto';

@Injectable()
export class AccountTypeService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountTypeRepository)
    private accountTypeRepository: typeof AccountType,
  ) {}

  async findAll(options?: FindOptions<Attributes<AccountType>>) {
    return await this.accountTypeRepository.findAll({
      ...options,
    });
  }

  async findOne(options?: FindOptions<Attributes<AccountType>>) {
    return await this.accountTypeRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<AccountType>>) {
    const accountType = await this.findOne(options);
    if (!accountType) throw new NotFoundException(`Account type is not found!`);

    return accountType;
  }

  async create(data: Attributes<AccountType>) {
    const accountType = new AccountType({ ...data });
    return accountType.save();
  }

  async makeAccountTypeResponse(type: AccountType) {
    return new AccountTypeResponse(type);
  }

  async makeAccountTypesResponse(types: AccountType[]) {
    const typesResponse: AccountTypeResponse[] = [];

    for (let i = 0; i < types.length; i++) {
      const typeResponse = await this.makeAccountTypeResponse(types[i]);
      typesResponse.push(typeResponse);
    }

    return typesResponse;
  }

  async fetchAllAccountTypes() {
    const types = await this.findAll({});
    return this.makeAccountTypesResponse(types);
  }
}
