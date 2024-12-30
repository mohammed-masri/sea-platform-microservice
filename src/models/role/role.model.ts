import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
import { Account } from '../account/account.model';
import { AccountRoles } from '../account-role/account-role.model';
import { AccountPermission } from '../account-permission/account-permission.model';
import { RolePermission } from '../role-permission/role-permission.model';

@Table({
  tableName: 'roles', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Role extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string | undefined;

  @Column({
    type: DataType.ENUM(...Object.values(Constants.Account.AccountTypes)),
    allowNull: false,
  })
  type: Constants.Account.AccountTypes;

  @BelongsToMany(() => Account, () => AccountRoles)
  accounts: Account[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];

  @HasMany(() => AccountPermission)
  accountPermissions: AccountPermission[];
}
