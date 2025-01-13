import { ApiProperty } from '@nestjs/swagger';
import { Constants } from 'src/config';
import { Application } from './application.model';
import { FileResponse } from '../file/file.dto';

export class ApplicationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  description: string | undefined;
  @ApiProperty({ type: FileResponse, nullable: true })
  iconFile: FileResponse | undefined;
  @ApiProperty({
    enum: Constants.Application.ApplicationStatuses,
  })
  status: Constants.Application.ApplicationStatuses;
  @ApiProperty()
  URL: string;

  constructor(application: Application, iconFile: FileResponse | undefined) {
    this.id = application.id;
    this.name = application.name;
    this.description = application.description;
    this.iconFile = iconFile;
    this.status = application.status;
    this.URL = application.URL;
  }
}
