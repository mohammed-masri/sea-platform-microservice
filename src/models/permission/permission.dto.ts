import { ApiProperty } from '@nestjs/swagger';
import { Constants } from 'src/config';
import { IPermission } from 'src/config/constants/permission';

export class PermissionResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: Constants.Permission.PermissionKeys;

  @ApiProperty({ type: Boolean })
  isLeaf: boolean;

  @ApiProperty({ type: PermissionResponse, isArray: true, nullable: true })
  children: PermissionResponse[] | undefined;

  constructor(permission: IPermission, children: PermissionResponse[]) {
    this.name = permission.name;
    this.key = permission.key;
    this.children = children;
    this.isLeaf = !children || !children?.length;
  }
}

export class AllPermissionResponse {
  @ApiProperty({ type: PermissionResponse, isArray: true })
  User: PermissionResponse[];
  @ApiProperty({ type: PermissionResponse, isArray: true })
  Admin: PermissionResponse[];
  constructor(User: PermissionResponse[], Admin: PermissionResponse[]) {
    this.Admin = Admin;
    this.User = User;
  }
}
