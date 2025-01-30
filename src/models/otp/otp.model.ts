import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { Account } from '../account/account.model';
import { DataTypes } from 'sequelize';
import { CONSTANTS } from 'sea-platform-helpers';

@Table({
  tableName: 'OTPs', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class OTP extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  otpCode: string;

  @Column
  expiresAt: Date;

  @Column
  identifier: string;

  @Default(CONSTANTS.OTP.NumberOfTries)
  @Column(DataTypes.INTEGER)
  remainingTries;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId: string | null;
}
