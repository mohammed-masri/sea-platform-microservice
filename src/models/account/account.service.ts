import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from './account.model';
import { Constants } from 'src/config';
import { Attributes, FindOptions } from 'sequelize';
import { AccountResponse } from './account.dto';
import { Op } from 'sequelize';
import { Utils } from 'sea-backend-helpers';
import { AccountTypeService } from '../account-type/account-type.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountRepository)
    private accountRepository: typeof Account,
    private readonly accountTypeService: AccountTypeService,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<Account>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: accounts } =
      await this.accountRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      accounts,
    };
  }

  async findOne(options?: FindOptions<Attributes<Account>>) {
    return await this.accountRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Account>>) {
    const account = await this.findOne(options);
    if (!account) throw new NotFoundException(`Account is not found!`);

    return account;
  }

  async checkPhoneNumberRegistered(phoneNumber: string) {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        phoneNumber: { [Op.eq]: phoneNumber },
      },
    });

    if (existingAccount) {
      throw new BadRequestException('Phone Number already in use');
    }
  }

  async checkEmailRegistered(email: string) {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (existingAccount) {
      throw new BadRequestException('Email already in use');
    }
  }

  async create(data: Attributes<Account>, typeId: string) {
    const [accountType, ,] = await Promise.all([
      this.accountTypeService.checkIsFound({ where: { id: typeId } }),
      this.checkPhoneNumberRegistered(data.phoneNumber),
      this.checkEmailRegistered(data.email),
    ]);

    const account = new Account({
      ...data,
      type: accountType.key,
      typeId: accountType.id,
    });
    return account.save();
  }

  async update(account: Account, data: Attributes<Account>) {
    if (data.phoneNumber && data.phoneNumber !== account.phoneNumber)
      await this.checkPhoneNumberRegistered(data.phoneNumber);
    if (data.email && data.email !== account.email)
      await this.checkEmailRegistered(data.email);

    return await account.update({ ...data });
  }

  async toggleLockStatus(account: Account) {
    account.isLocked = !account.isLocked;
    return await account.save();
  }

  async delete(account: Account) {
    await account.destroy();
  }

  async changePassword(
    account: Account,
    newPassword: string,
    compareTheOldPassword: boolean = false,
    oldPassword: string = null,
  ) {
    if (compareTheOldPassword) {
      const isCorrect = await Utils.Bcrypt.comparePassword(
        oldPassword,
        account?.password,
      );

      if (!isCorrect)
        throw new UnauthorizedException('Old password is incorrect.');
    }

    account.password = newPassword;
    await account.save();
    return true;
  }

  makeAccountResponse(account: Account) {
    return new AccountResponse(account);
  }

  makeAccountsResponse(accounts: Account[]) {
    const accountsResponse: AccountResponse[] = [];
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const AccountResponse = this.makeAccountResponse(account);
      accountsResponse.push(AccountResponse);
    }
    return accountsResponse;
  }
}
