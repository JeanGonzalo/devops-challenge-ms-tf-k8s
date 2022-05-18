import { EmailDTO } from './dto/email.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EMAIL } from 'src/common/models/models';
import { IEmail } from 'src/common/interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(@InjectModel(EMAIL.name) private readonly model: Model<IEmail>) {}

  async findByEmail(from: string) {
    return await this.model.findOne({ from });
  }

  async create(emailDTO: EmailDTO): Promise<IEmail> {
    const newEmail = new this.model({ ...emailDTO });
    return await newEmail.save();
  }

  async findAll(): Promise<IEmail[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<IEmail> {
    return await this.model.findById(id);
  }

  async update(id: string, emailDTO: EmailDTO): Promise<IEmail> {
    const email = { ...emailDTO};
    return await this.model.findByIdAndUpdate(id, email, { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
