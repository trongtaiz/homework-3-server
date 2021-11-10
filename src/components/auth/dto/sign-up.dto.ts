import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class SignUpDto {
  constructor(body: SignUpDto | null = null) {
    if (body) {
      this.username = body.username;
      this.password = body.password;
    }
  }

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  username!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
