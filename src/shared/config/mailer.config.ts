import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import * as path from 'path';

import envConfig from 'src/shared/config/config';

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // Sử dụng TLS, không phải SSL trực tiếp
    auth: {
      user: 'apikey',
      pass: envConfig.SENDGRID_API_KEY,
    },
  },
  defaults: {
    from: envConfig.MAILER_DEFAULT_FROM_EMAIL,
  },
  template: {
    // dir: path.join(__dirname, '../../../email-templates'), // Điều chỉnh đường dẫn tương đối
    dir: path.join(process.cwd(), 'src', 'email-templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
