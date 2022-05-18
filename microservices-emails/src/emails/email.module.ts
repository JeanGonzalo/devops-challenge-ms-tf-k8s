import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSchema } from './schema/email.schema';
import { EMAIL } from 'src/common/models/models';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: EMAIL.name,
        useFactory: () => EmailSchema,
      },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
