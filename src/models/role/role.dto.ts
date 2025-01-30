import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.model';
import { PermissionResponseForRole } from '../permission/permission.dto';
import { CONSTANTS } from 'sea-platform-helpers';

export class RoleShortResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  color: string;
  @ApiProperty({
    enum: CONSTANTS.Account.AccountTypes,
  })
  type: CONSTANTS.Account.AccountTypes;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.description = role.description;
    this.color = role.color;
    this.type = role.type;
  }
}

export class RoleFullResponse extends RoleShortResponse {
  @ApiProperty({ type: PermissionResponseForRole, isArray: true })
  permissions: PermissionResponseForRole[];

  constructor(role: Role, permissions: PermissionResponseForRole[]) {
    super(role);
    this.permissions = permissions;
  }
}
