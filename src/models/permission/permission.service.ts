import { BadRequestException, Injectable } from '@nestjs/common';

import { IPermission } from 'src/config/constants/permission';
import {
  AllPermissionResponse,
  PermissionChecked,
  PermissionResponse,
  PermissionResponseForRole,
} from './permission.dto';
import { Constants } from 'src/config';
import { Utils } from 'sea-platform-helpers';
@Injectable()
export class PermissionService {
  constructor() {}

  async findPermissionByKey(key: string) {
    let permission: IPermission | undefined = undefined;
    for (let i = 0; i < Constants.Permission.PERMISSIONS.length; i++) {
      const p = Constants.Permission.PERMISSIONS[i];

      permission = await Utils.DFS.findItem(
        p,
        (node) => node.key === key,
        'children',
      );

      if (permission) break;
    }

    return permission;
  }

  async getLeafKeys(key: string) {
    const permission = await this.findPermissionByKey(key);
    return (await Utils.DFS.getAllLeafNodes(permission, 'children').map(
      (p) => p.key,
    )) as string[];
  }

  async getAllLeafKeys() {
    let keys: string[] = [];

    for (let i = 0; i < Constants.Permission.PERMISSIONS.length; i++) {
      const p = Constants.Permission.PERMISSIONS[i];
      const leafKeys = await this.getLeafKeys(p.key as string);
      keys = Utils.Array.concatWithoutDuplicates(
        keys,
        leafKeys,
        (a, b) => a === b,
      );
    }

    return keys;
  }

  async isLeafKey(key: string) {
    const leafKeys = await this.getAllLeafKeys();
    return leafKeys.includes(key);
  }

  async checkIsLeafKey(key: string) {
    const isLeaf = await this.isLeafKey(key);

    if (!isLeaf) {
      throw new BadRequestException(`(${key}) is not a leaf key`);
    }
  }

  async checkAreLeafKeys(keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      await this.checkIsLeafKey(key);
    }
  }

  private async makePermissionResponse(permission: IPermission) {
    const children: PermissionResponse[] = [];

    for (let i = 0; i < permission.children?.length; i++) {
      const child = permission.children[i];
      const childResponse = await this.makePermissionResponse(child);
      children.push(childResponse);
    }

    return new PermissionResponse(permission, children);
  }

  private async makePermissionsResponse(permissions: IPermission[]) {
    const permissionsResponse: PermissionResponse[] = [];

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      const permissionResponse = await this.makePermissionResponse(permission);
      permissionsResponse.push(permissionResponse);
    }

    return permissionsResponse;
  }

  async fetchAllPermissions() {
    const [user, admin] = await Promise.all([
      this.makePermissionsResponse(Constants.Permission.USER_PERMISSIONS),
      this.makePermissionsResponse(Constants.Permission.ADMIN_PERMISSIONS),
    ]);

    return new AllPermissionResponse(user, admin);
  }

  async makePermissionResponseForRole(
    permission: IPermission,
    permissionKeys: string[],
  ): Promise<PermissionResponseForRole> {
    const children: PermissionResponseForRole[] = [];

    const isLeaf = !permission.children || permission.children.length === 0;

    // Determine allChecked and someChecked based on whether the node is a leaf.
    let allChecked = true,
      someChecked = false;

    if (isLeaf) {
      allChecked = permissionKeys.includes(permission.key as string);
    } else {
      for (const child of permission.children) {
        const childResponse = await this.makePermissionResponseForRole(
          child,
          permissionKeys,
        );
        children.push(childResponse);

        // Update allChecked and someChecked based on child responses.
        if (childResponse.checked !== PermissionChecked.All) {
          allChecked = false;
        }
        if (childResponse.checked !== PermissionChecked.None) {
          someChecked = true;
        }
      }
    }

    // Determine the checked status for the current permission.
    const checked = allChecked
      ? PermissionChecked.All
      : someChecked
        ? PermissionChecked.Some
        : PermissionChecked.None;

    return new PermissionResponseForRole(permission, children, checked);
  }
}
