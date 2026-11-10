import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { PaymentsModule } from './services/payments/payments.module.js';
import { StudentsModule } from './services/students/students.module.js';
import { CoursesModule } from './services/courses/courses.module.js';
import { FinanceModule } from './services/finance/finance.module.js';

@Module({
  imports: [DatabaseModule, FinanceModule, CoursesModule, StudentsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
