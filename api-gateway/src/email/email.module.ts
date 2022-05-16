import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { EmailController } from './email.controller';

@Module({
  imports: [ProxyModule],
  controllers: [EmailController]
})
export class EmailModule {}
