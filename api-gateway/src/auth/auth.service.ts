import { ClientProxySendEmails } from './../common/proxy/client-proxy';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailDTO } from 'src/email/dto/email.dto';
import { EmailMSG } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySendEmails,
    private readonly jwtService: JwtService,
  ) {}

  private _clientProxyEmail = this.clientProxy.clientProxyEmails();
  async validateFrom(from: string): Promise<any> {
    const email = await this._clientProxyEmail
      .send(EmailMSG.VALID_EMAIL, {
        from,
      })
      .toPromise();

    if (email) return email;

    return null;
  }

  async signIn(email: any) {
    const payload = {
      from: email.from,
      sub: email._id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(emailDTO: EmailDTO) {
    return await this._clientProxyEmail
      .send(EmailMSG.CREATE, emailDTO)
      .toPromise();
  }
}
