import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
import { Role } from '../role/role.model';

@Table({
  tableName: 'role-permissions', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class RolePermission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  roleId: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Permission.AdminPermissionKeys),
      ...Object.values(Constants.Permission.UserPermissionKeys),
    ),
    allowNull: false,
  })
  permissionKey: string;
}
