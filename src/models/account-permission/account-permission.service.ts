import { Inject, Injectable } from '@nestjs/common';

import { Constants } from 'src/config';
import { Attributes } from 'sequelize';
import { AccountPermission } from './account-permission.model';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class AccountPermissionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountPermissionRepository)
    private accountPermissionRepository: typeof AccountPermission,
    private readonly permissionService: PermissionService,
  ) {}

  async findAllForRole(roleId: string) {
    return await this.accountPermissionRepository.findAll({
      where: { roleId },
    });
  }

  async create(data: Attributes<AccountPermission>) {
    await this.permissionService.checkIsLeafKey(data.permissionKey);

    const accountPermission = new AccountPermission({
      ...data,
    });
    return await accountPermission.save();
  }

  async delete(accountPermission: AccountPermission) {
    return await accountPermission.destroy({ force: true });
  }
}
