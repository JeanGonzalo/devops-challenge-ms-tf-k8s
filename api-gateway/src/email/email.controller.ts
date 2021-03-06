import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmailMSG } from '../common/constants';
import { Observable } from 'rxjs';
import { EmailDTO  } from './dto/email.dto';
import { ClientProxySendEmails } from '../common/proxy/client-proxy';
import { IEmail } from 'src/common/interfaces/email.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('emails')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/email')
export class EmailController {
  constructor(private readonly clientProxy: ClientProxySendEmails) {}
  private _clientProxyEmail = this.clientProxy.clientProxyEmails();

  @Post()
  create(@Body() emailDTO: EmailDTO): Observable<IEmail> {
    return this._clientProxyEmail.send(EmailMSG.CREATE, emailDTO);
  }

  @Get()
  findAll(): Observable<IEmail[]> {
    return this._clientProxyEmail.send(EmailMSG.FIND_ALL, '');
  }

  @Get()
  findOne(): Observable<IEmail> {
    return this._clientProxyEmail.send(EmailMSG.FIND_ONE,'');
  }

  @Put()
  update(): Observable<IEmail> {
    return this._clientProxyEmail.send(EmailMSG.UPDATE, '' );
  }

  @Delete()
  delete(): Observable<any> {
    return this._clientProxyEmail.send(EmailMSG.DELETE, '');
  }
}
