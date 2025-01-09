import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { File } from './file.model';
import { Attributes, FindOptions } from 'sequelize';
import { FileResponse } from './file.dto';

@Injectable()
export class FileService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.FileRepository)
    private fileRepository: typeof File,
  ) {}

  async findOne(options?: FindOptions<Attributes<File>>) {
    return await this.fileRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<File>>) {
    const file = await this.findOne(options);
    if (!file) throw new NotFoundException(`File is not found!`);

    return file;
  }

  async create(data: Attributes<File>) {
    const file = new File({
      ...data,
    });

    return await file.save();
  }

  async delete(file: File) {
    return await file.destroy({ force: true });
  }

  async makeFileResponse(file: File) {
    return new FileResponse(file);
  }
}
