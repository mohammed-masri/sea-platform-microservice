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
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.model';
import { RolePermissionService } from '../role-permission/role-permission.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountRepository)
    private accountRepository: typeof Account,
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
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

  async create(data: Attributes<Account>, roleIds: string[]) {
    await Promise.all([
      this.checkPhoneNumberRegistered(data.phoneNumber),
      this.checkEmailRegistered(data.email),
    ]);

    let roles: Role[] = [];

    if (roleIds) roles = await this.roleService.findByIds(roleIds);

    let account = new Account({
      ...data,
    });

    account = await account.save();

    await Promise.all(
      roles.map((r) => this.roleService.assignRoleToAccount(account, r)),
    );

    return account;
  }

  async updateMe(account: Account, data: Attributes<Account>) {
    const roles = account.roles
      ? account.roles
      : await this.roleService.findAllForAccount(account.id);

    // pass same current role Ids
    const roleIds = roles.map((r) => r.id);

    return await this.update(account, data, roleIds);
  }

  async update(
    account: Account,
    data: Attributes<Account>,
    newRoleIds: string[],
  ) {
    if (data.phoneNumber && data.phoneNumber !== account.phoneNumber)
      await this.checkPhoneNumberRegistered(data.phoneNumber);
    if (data.email && data.email !== account.email)
      await this.checkEmailRegistered(data.email);

    // Fetch current and new roles
    const [currentRoles, newRoles] = await Promise.all([
      account.roles
        ? account.roles
        : await this.roleService.findAllForAccount(account.id),
      await this.roleService.findByIds(newRoleIds),
    ]);

    // Determine roles to be removed and added
    const rolesToRemove = currentRoles.filter(
      (currentRole) =>
        !newRoles.some((newRole) => newRole.id === currentRole.id),
    );
    const rolesToAdd = newRoles.filter(
      (newRole) =>
        !currentRoles.some((currentRole) => currentRole.id === newRole.id),
    );

    if (rolesToRemove.length > 0) {
      await Promise.all(
        rolesToRemove.map((r) =>
          this.roleService.unassignRoleFromAccount(account, r),
        ),
      );
    }
    if (rolesToAdd.length > 0) {
      await Promise.all(
        rolesToAdd.map((r) => this.roleService.assignRoleToAccount(account, r)),
      );
    }

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

  async makeAccountResponse(account: Account) {
    let roles: Role[] = [];
    if (account.roles && account.roles.length) roles = account.roles;
    else {
      const acc = await this.findOne({
        where: { id: account.id },
        include: [Role],
      });
      if (acc) roles = acc.roles;
    }

    const rolesResponse = await this.roleService.makeRolesShortResponse(roles);

    const roleIds = roles.map((r) => r.id);
    const rolePermissions =
      await this.rolePermissionService.findAllForRoles(roleIds);
    const permissionKeys = rolePermissions.map((p) => p.permissionKey);

    return new AccountResponse(account, rolesResponse, permissionKeys);
  }

  async makeAccountsResponse(accounts: Account[]) {
    const accountsResponse: AccountResponse[] = [];
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const AccountResponse = await this.makeAccountResponse(account);
      accountsResponse.push(AccountResponse);
    }
    return accountsResponse;
  }
}
