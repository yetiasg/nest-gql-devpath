import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PdfService, User } from './pdf.service';

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @MessagePattern('generate_pdf')
  generatePdf(@Payload() payload: Date) {
    return this.pdfService.generatePdf(payload as unknown as User[]);
  }
}
