import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import type { Pool, PoolConnection } from 'mysql2/promise';

@Injectable()
export class PaymentsService {

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async obtenerDeuda(estudianteId: number) {
    const query = `
      SELECT cf.id as cargo_id, c.nombre as curso, cf.tipo, cf.numero_cuota, cf.monto_esperado, cf.fecha_vencimiento
      FROM cargos_financieros cf
      JOIN inscripciones i ON cf.inscripcion_id = i.id
      JOIN cursos c ON i.curso_id = c.id
      WHERE i.estudiante_id = ? AND cf.estado = 'PENDIENTE'
      ORDER BY cf.fecha_vencimiento ASC
    `;
    const [rows] = await this.pool.execute(query, [estudianteId]);
    return rows;
  }
  
  async getStudentSummary(estudianteId: number) {
    const sql = `
      SELECT 
          cf.id AS cargo_id,
          c.nombre AS curso,
          cf.tipo AS tipo, 
          cf.numero_cuota,       
          cf.estado,             
          cf.monto_esperado
      FROM cargos_financieros cf
      JOIN inscripciones i ON cf.inscripcion_id = i.id
      JOIN cursos c ON i.curso_id = c.id
      WHERE i.estudiante_id = ?
    `;
    
    // Ejecutamos la consulta cruda y extraemos las filas
    const [rows] = await this.pool.query(sql, [estudianteId]);
    
    return rows;
  }

  async procesarPago(cargoId: number) {
    const [result]: any = await this.pool.execute(
      'UPDATE cargos_financieros SET estado = "PAGADO" WHERE id = ? AND estado = "PENDIENTE"',
      [cargoId]
    );
    if (result.affectedRows === 0) throw new BadRequestException('El cargo ya está pagado o no existe');
    return { success: true, message: 'Pago registrado correctamente' };
  }

  async processPayment(cargoId: number) {
    // 1. Actualizamos la cuota a PAGADO
    await this.pool.query(`UPDATE cargos_financieros SET estado = 'PAGADO' WHERE id = ?`, [cargoId]);

    // 2. Buscamos a qué inscripción pertenece este cargo
    const [cargo]: any = await this.pool.query(`SELECT inscripcion_id FROM cargos_financieros WHERE id = ?`, [cargoId]);
    
    if (cargo.length > 0) {
      const inscripcionId = cargo[0].inscripcion_id;
      
      // 3. Verificamos si quedan cuotas pendientes para esta inscripción
      const [pendientes]: any = await this.pool.query(`
        SELECT COUNT(*) as total_pendientes 
        FROM cargos_financieros 
        WHERE inscripcion_id = ? AND estado = 'PENDIENTE'
      `, [inscripcionId]);

      // 4. Si ya no hay pendientes (pagó todo), eliminamos el historial de cargos de esa inscripción
      if (pendientes[0].total_pendientes === 0) {
        await this.pool.query(`DELETE FROM cargos_financieros WHERE inscripcion_id = ?`, [inscripcionId]);
      }
    }
    
    return { success: true };
  }
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
