import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import hbs from 'nodemailer-express-handlebars';
import 'dotenv/config';

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

    console.log(`${process.env.FRONTEND_URL}/${link}`);

    try {
      await this.transporter.sendMail(email);
    } catch (error) {
      console.log(error);
    }
  }
}
