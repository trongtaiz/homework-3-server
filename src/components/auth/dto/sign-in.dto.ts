import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import SignUpDto from './sign-up.dto';

export default class SignInDto {
  constructor(body: SignInDto | null = null) {
    if (body) {
      this.email = body.email;
      this.password = body.password;      
    }
  }

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  email!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
