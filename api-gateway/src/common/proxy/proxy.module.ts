import { Module } from '@nestjs/common';
import { ClientProxySendEmails } from './client-proxy';

@Module({
  providers: [ClientProxySendEmails],
  exports: [ClientProxySendEmails],
})
export class ProxyModule {}
