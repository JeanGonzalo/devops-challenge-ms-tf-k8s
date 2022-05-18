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

  async create(emailDTO: EmailDTO) {
    const newEmail = new this.model({ ...emailDTO });
    await newEmail.save();
    return {
      msg: `Hello ${emailDTO.to} your message will be send `,
    };
  }

  async findAll() {
    return {
      msg: 'ERROR',
    };
  }

  async findOne() {
    return {
      msg: 'ERROR',
    };
  }

  async update() {
    return {
      msg: 'ERROR',
    };
  }

  async delete() {
    return {
      msg: 'ERROR',
    };
  }
}
