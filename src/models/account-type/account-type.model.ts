import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Account } from '../account/account.model';

@Table({
  tableName: 'account-types',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['key'],
      name: 'unique_key',
    },
  ],
})
export class AccountType extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  name: string;

  @HasMany(() => Account, 'typeId')
  accounts: Account[];
}
