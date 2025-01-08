import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
@Table({
  tableName: 'applications', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Application extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  iconURL: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  URL: string;

  @Default(Constants.Application.ApplicationStatuses.Unavailable)
  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Application.ApplicationStatuses),
    ),
    allowNull: false,
  })
  status: Constants.Application.ApplicationStatuses;
}
