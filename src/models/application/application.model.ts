import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
import { File } from '../file/file.model';
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
  URL: string;

  @Default(Constants.Application.ApplicationStatuses.Unavailable)
  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Application.ApplicationStatuses),
    ),
    allowNull: false,
  })
  status: Constants.Application.ApplicationStatuses;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  iconFileId: string | undefined;

  @BelongsTo(() => File, { as: 'iconFile' })
  iconFile: File | undefined;
}
