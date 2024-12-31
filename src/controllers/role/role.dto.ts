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
import { IsArrayValuesIn } from 'src/decorators/is-array-values-in.decorator';
import { Constants } from 'src/config';
import { RoleShortResponse } from 'src/models/role/role.dto';

const permissionKeys = [...Object.values(Constants.Permission.PermissionKeys)];

export class FindAllRolesDto extends FindAllDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'the roles account type (nothing means all)',
    enum: Constants.Account.AccountTypes,
  })
  @IsIn([...Object.values(Constants.Account.AccountTypes), 'all'])
  @IsOptional()
  accountType: Constants.Account.AccountTypes | 'all';
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
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: string[];

  @ApiProperty({
    enum: Constants.Account.AccountTypes,
  })
  @IsEnum(Constants.Account.AccountTypes)
  type: Constants.Account.AccountTypes;
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
    description: 'the list of the permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsArrayValuesIn(permissionKeys, {
    message: `Each permission must be one of the valid keys: ${permissionKeys.join(', ')}`,
  })
  permissionKeys: Constants.Permission.PermissionKeys[];
}
