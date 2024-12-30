import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { Account } from '../account/account.model';

@Table({
  tableName: 'account-roles', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class AccountRoles extends Model<AccountRoles> {
  @ForeignKey(() => Account)
  @Column
  accountId: string;

  @ForeignKey(() => Role)
  @Column
  roleId: string;
}
