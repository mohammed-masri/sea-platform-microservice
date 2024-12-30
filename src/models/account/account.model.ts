import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { Utils } from 'sea-backend-helpers';

import { OTP } from '../otp/otp.model';
import { Constants } from 'src/config';
import { Role } from '../role/role.model';
import { AccountRoles } from '../account-role/account-role.model';
import { AccountPermission } from '../account-permission/account-permission.model';

@Table({
  tableName: 'accounts',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'unique_email',
    },
    {
      unique: true,
      fields: ['phoneNumber'],
      name: 'unique_phone_number',
    },
  ],
})
export class Account extends Model {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isLocked: boolean;

  @HasMany(() => OTP)
  OTPs: OTP[];

  @Column({
    type: DataType.ENUM(...Object.values(Constants.Account.AccountTypes)),
    allowNull: false,
  })
  type: Constants.Account.AccountTypes;

  @BelongsToMany(() => Role, () => AccountRoles)
  roles: Role[];

  @HasMany(() => AccountPermission)
  accountPermissions: AccountPermission[];

  @BeforeCreate
  @BeforeUpdate
  static async handleSensitiveData(account: Account) {
    if (account.email) {
      account.email = Utils.String.normalizeString(account.email);
    }
    if (account.password && account.changed('password')) {
      account.password = await Utils.Bcrypt.hashPassword(account.password);
    }

    if (account.phoneNumber) {
      account.phoneNumber = Utils.PhoneNumber.normalizePhoneNumber(
        account.phoneNumber,
      );
    }
  }
}
