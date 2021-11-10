import SignUpDto from './sign-up.dto';

export default class SignInDto extends SignUpDto {
  constructor(body: SignUpDto | null = null) {
    super(body);
  }
}
