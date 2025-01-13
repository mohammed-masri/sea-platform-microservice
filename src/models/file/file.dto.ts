import { ApiProperty } from '@nestjs/swagger';
import { File } from './file.model';

export class FileResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  URL: string;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.size = file.size;
    this.mimetype = file.mimetype;
    this.URL = 'http://localhost:4001/' + file.path.replace(/\\/g, '/'); // TODO
  }
}
