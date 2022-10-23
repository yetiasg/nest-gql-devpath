import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export type User = {
  id: string;
  externalId?: string;
  isActive: boolean;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  role: Role;
};

@Injectable()
export class PdfService {
  async generatePdf(users: User[]): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const template = users
      .map((user) => Object.values(user).join(' - '))
      .join(', ');

    await page.setContent(template);

    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      printBackground: true,
    });

    await browser.close();
    return pdf;
  }
}
