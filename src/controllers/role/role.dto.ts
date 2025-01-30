import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsIn,
} from 'class-validator';
import { ArrayDataResponse, FindAllDto } from 'src/common/global.dto';
import { RoleShortResponse } from 'src/models/role/role.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { Decorators } from 'sea-backend-helpers';

const permissionKeys = [...Object.values(CONSTANTS.Permission.PermissionKeys)];

export class FindAllRolesDto extends FindAllDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'the roles account type (nothing means all)',
    enum: CONSTANTS.Account.AccountTypes,
  })
  @IsIn([...Object.values(CONSTANTS.Account.AccountTypes), 'all'])
  @IsOptional()
  accountType: CONSTANTS.Account.AccountTypes | 'all';
}

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'IT Support',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    description: 'The hex code color',
    example: '#000000',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Decorators.IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: string[];

  @ApiProperty({
    enum: CONSTANTS.Account.AccountTypes,
  })
  @IsEnum(CONSTANTS.Account.AccountTypes)
  type: CONSTANTS.Account.AccountTypes;
}

export class RoleShortArrayDataResponse extends ArrayDataResponse<RoleShortResponse> {
  @ApiProperty({ type: RoleShortResponse, isArray: true })
  data: RoleShortResponse[];
  constructor(
    totalCount: number,
    data: Array<RoleShortResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'IT Support',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    description: 'The hex code color',
    example: '#000000',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Decorators.IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: CONSTANTS.Permission.PermissionKeys[];
}
