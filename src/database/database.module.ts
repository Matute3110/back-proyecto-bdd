import { Module, Global } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Global() // Hace que el pool esté disponible en toda la app
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: async () => {
        const pool = mysql.createPool({
          host: 'localhost', 
          user: 'root',
          password: '',
          database: 'bdd-proyecto',
          connectionLimit: 50,
        });
        return pool;
      },
    },
  ],
  exports: ['DATABASE_POOL'], 
})
export class DatabaseModule {}