import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import hbs from 'nodemailer-express-handlebars';
import {
  Injectable,
  InternalServerErrorException,
  Module,
} from '@nestjs/common';

@Injectable()
export class MailUtil {
  private readonly transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.resolve('./src/utils/views'),
          layoutsDir: path.resolve('./src/utils/views/layouts'),
          defaultLayout: 'blank',
        },
        viewPath: path.resolve('./src/utils/views'),
        extName: '.hbs',
      }),
    );
  }

  async sendInvitationMail(link: string, userEmail): Promise<void> {
    console.log(`${process.env.FRONTEND_URL}/${link}`);
    const email = {
      from: `"Google classroom" <${process.env.EMAIL}>`,
      to: userEmail,
      subject: 'Invitation Email',
      template: 'invitation',
      context: {
        title: 'Join classroom',
        activationLink: `${process.env.FRONTEND_URL}/${link}`,
      },
    };

    try {
      await this.transporter.sendMail(email);
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerifyEmail(token: string, email: string) {
    console.log(`${process.env.FRONTEND_URL}/verify-email/${token}`);
    const options = {
      from: `"Google classroom" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Verify Email',
      template: 'verify-email',
      context: {
        title: 'Verify Email',
        verifyLink: `${process.env.FRONTEND_URL}/verify-email/${token}`,
      },
    };

    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

@Module({
  providers: [MailUtil],
  exports: [MailUtil],
})
export class MailModule {}
