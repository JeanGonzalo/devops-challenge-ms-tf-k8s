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
  findOne(@Payload() id: string) {
    return this.emailService.findOne(id);
  }
  @MessagePattern(EmailMsg.UPDATE)
  update(@Payload() payload: any) {
    return this.emailService.update(payload.id, payload.emailDTO);
  }

  @MessagePattern(EmailMsg.DELETE)
  delete(@Payload() id: string) {
    return this.emailService.delete(id);
  }

  @MessagePattern(EmailMsg.VALID_EMAIL)
  async validateEmail(@Payload() payload) {
    const email = await this.emailService.findByFrom(payload.from);

    if (email ) return email;

    return null;
  }
}
