import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { Injectable, Module } from '@nestjs/common';

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
}

@Module({
  providers: [MailUtil],
  exports: [MailUtil],
})
export class MailModule {}
