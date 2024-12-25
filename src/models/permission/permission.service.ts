import { Injectable } from '@nestjs/common';

import { IPermission } from 'src/config/constants/permission';
import { AllPermissionResponse, PermissionResponse } from './permission.dto';
import { Constants } from 'src/config';

@Injectable()
export class PermissionService {
  constructor() {}

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
}
