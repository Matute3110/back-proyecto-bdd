import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { CreateFinanceDto } from './dto/create-finance.dto.js';
import type { UpdateFinanceDto } from './dto/update-finance.dto.js';
import type { Pool, PoolConnection } from 'mysql2/promise';


@Injectable()
export class FinanceService {

constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

async procesarInscripcion(estudianteId: number, cursoId: number) {
    const connection: PoolConnection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Obtener la configuración del curso
      const [cursos]: any = await connection.execute(
        'SELECT monto_inicial, monto_cuota, cantidad_cuotas FROM cursos WHERE id = ?',
        [cursoId]
      );
      const curso = cursos[0];
      if (!curso) throw new Error('Curso no encontrado');

      // 2. Registrar la inscripción
      const [inscripcionRes]: any = await connection.execute(
        'INSERT INTO inscripciones (estudiante_id, curso_id) VALUES (?, ?)',
        [estudianteId, cursoId]
      );
      const inscripcionId = inscripcionRes.insertId;

      // 3. Generar la Inicial
      const insertCargo = `
        INSERT INTO cargos_financieros 
        (inscripcion_id, tipo, numero_cuota, monto_esperado, fecha_vencimiento) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const hoy = new Date();
      await connection.execute(insertCargo, [
        inscripcionId, 'INICIAL', 0, curso.monto_inicial, hoy
      ]);

      // 4. Generar las Cuotas secuenciales (cada 30 días)
      for (let i = 1; i <= curso.cantidad_cuotas; i++) {
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(hoy.getDate() + (30 * i));
        
        await connection.execute(insertCargo, [
          inscripcionId, 'CUOTA', i, curso.monto_cuota, fechaVencimiento
        ]);
      }

      await connection.commit();
      return { success: true, message: 'Inscripción y cargos generados exitosamente', inscripcionId };

    } catch (error) {
      await connection.rollback();
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Fallo en la transacción financiera: ${errorMessage}`);
    } finally {
      connection.release();
    }
  }
  create(createFinanceDto: CreateFinanceDto) {
    return 'This action adds a new finance';
  }

  findAll() {
    return `This action returns all finance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finance`;
  }

  update(id: number, updateFinanceDto: UpdateFinanceDto) {
    return `This action updates a #${id} finance`;
  }

  remove(id: number) {
    return `This action removes a #${id} finance`;
  }
}
