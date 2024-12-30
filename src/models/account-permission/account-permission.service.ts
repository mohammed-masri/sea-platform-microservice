import { Inject, Injectable } from '@nestjs/common';

import { Constants } from 'src/config';
import { Attributes } from 'sequelize';
import { AccountPermission } from './account-permission.model';
import { PermissionService } from '../permission/permission.service';
import { Account } from '../account/account.model';
import { Role } from '../role/role.model';

@Injectable()
export class AccountPermissionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountPermissionRepository)
    private accountPermissionRepository: typeof AccountPermission,
    private readonly permissionService: PermissionService,
  ) {}

  async findAllForAccount(accountId: string) {
    return await this.accountPermissionRepository.findAll({
      where: { accountId },
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

  async updateKeysForAccount(
    account: Account,
    role: Role,
    newKeys: Constants.Permission.PermissionKeys[],
  ) {
    await this.permissionService.checkAreLeafKeys(newKeys);

    // Fetch current account permissions from the database
    const accountPermissions = await this.findAllForAccount(account.id);
    const currentKeys = accountPermissions.map((p) => p.permissionKey);

    // Determine keys to add and remove
    const keysToAdd = newKeys.filter((key) => !currentKeys.includes(key));
    const keysToRemove = currentKeys.filter((key) => !newKeys.includes(key));

    let permissionsHasBeenChanged = false;

    // Add new account permissions
    if (keysToAdd.length > 0) {
      permissionsHasBeenChanged = true;

      await Promise.all(
        keysToAdd.map((key) =>
          this.create({
            accountId: account.id,
            roleId: role.id,
            permissionKey: key,
          }),
        ),
      );
    }

    // Remove unnecessary account permissions
    if (keysToRemove.length > 0) {
      permissionsHasBeenChanged = true;
      const permissionsToRemove = accountPermissions.filter((p) =>
        keysToRemove.includes(p.permissionKey),
      );

      await Promise.all(permissionsToRemove.map((p) => this.delete(p)));
    }

    if (permissionsHasBeenChanged) {
      // TODO: invalid the JWTs for this account
    }
  }
}
