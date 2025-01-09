import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsIn,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ArrayDataResponse, FindAllDto } from 'src/common/global.dto';
import { Constants } from 'src/config';
import { ApplicationResponse } from 'src/models/application/application.dto';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'The name of the application',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    required: true,
    description: 'The icon file id of the application',
  })
  @IsString()
  iconFileId: string;

  @ApiProperty({
    required: true,
    description: 'The URL of the application',
  })
  @IsString()
  URL: string;
}

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'The name of the application',
    example: 'ANY',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    nullable: true,
  })
  @IsOptional()
  description: string | undefined;

  @ApiProperty({
    required: true,
    description: 'The icon file id of the application',
  })
  @IsString()
  iconFileId: string;

  @ApiProperty({
    required: true,
    description: 'The URL of the application',
  })
  @IsString()
  URL: string;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'The status of the application',
    enum: Constants.Application.ApplicationStatuses,
  })
  @IsIn([...Object.values(Constants.Application.ApplicationStatuses)])
  status: Constants.Application.ApplicationStatuses;
}

export class FindAllApplicationsDto extends FindAllDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'the application status',
    enum: Constants.Application.ApplicationStatuses,
  })
  @IsIn([...Object.values(Constants.Application.ApplicationStatuses), 'all'])
  @IsOptional()
  status: Constants.Application.ApplicationStatuses | 'all';
}

export class ApplicationArrayDataResponse extends ArrayDataResponse<ApplicationResponse> {
  @ApiProperty({ type: ApplicationResponse, isArray: true })
  data: ApplicationResponse[];
  constructor(
    totalCount: number,
    data: Array<ApplicationResponse>,
    page: number,
    limit: number,
  ) {
    super(totalCount, data, page, limit);
    this.data = data;
  }
}
