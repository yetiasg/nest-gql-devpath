import { Controller, Get, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { UserService } from './user.service';
import { Response } from 'express';
import { lastValueFrom, single } from 'rxjs';

@Public()
@Controller()
export class UserController {
  constructor(
    @Inject('PDF_SERVICE') private readonly pdfService: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @Get('/pdf')
  async get(@Res({ passthrough: true }) res: Response) {
    const users = await this.userService.getAll();

    type pdfDataResponse = { data: Buffer; type: string };

    const pdf: pdfDataResponse = await lastValueFrom(
      this.pdfService
        .send('generate_pdf', users)
        .pipe<pdfDataResponse>(single()),
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment;filename=report.pdf`);

    res.send(Buffer.from(pdf.data));
  }
}
