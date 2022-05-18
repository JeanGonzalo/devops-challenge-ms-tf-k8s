import { EmailService } from './email.service';
import { EmailDTO } from './dto/email.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailMsg } from 'src/common/constants';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern(EmailMsg.CREATE)
  create(@Payload() emailDTO: EmailDTO) {
    return this.emailService.create(emailDTO);
  }

  @MessagePattern(EmailMsg.FIND_ALL)
  findAll() {
    return this.emailService.findAll();
  }

  @MessagePattern(EmailMsg.FIND_ONE)
  findOne() {
    return this.emailService.findOne();
  }
  @MessagePattern(EmailMsg.UPDATE)
  update() {
    return this.emailService.update();
  }

  @MessagePattern(EmailMsg.DELETE)
  delete() {
    return this.emailService.delete();
  }

}
