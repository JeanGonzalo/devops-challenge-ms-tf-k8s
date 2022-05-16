import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmailDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly message: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly to: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly from: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly timeToLifeSec: number;
}
