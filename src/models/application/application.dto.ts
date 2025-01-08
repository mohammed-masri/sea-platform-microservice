import { ApiProperty } from '@nestjs/swagger';
import { Constants } from 'src/config';
import { Application } from './application.model';

export class ApplicationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  description: string | undefined;
  @ApiProperty()
  iconURL: string;
  @ApiProperty({
    enum: Constants.Application.ApplicationStatuses,
  })
  status: Constants.Application.ApplicationStatuses;
  @ApiProperty()
  URL: string;

  constructor(application: Application) {
    this.id = application.id;
    this.name = application.name;
    this.description = application.description;
    this.iconURL = application.iconURL;
    this.status = application.status;
    this.URL = application.URL;
  }
}
