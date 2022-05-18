import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FromDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly from: string;
}
