import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'files', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class File extends Model {
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
    type: DataType.BIGINT,
    allowNull: false,
  })
  size: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimetype: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;
}
