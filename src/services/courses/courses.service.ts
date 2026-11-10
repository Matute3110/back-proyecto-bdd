import { Injectable, Inject, InternalServerErrorException} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import type { Pool, PoolConnection } from 'mysql2/promise';


@Injectable()
export class CoursesService {

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async obtenerTodos() {
    try {
      const [rows] = await this.pool.query(
        'SELECT id, nombre, monto_inicial, monto_cuota, cantidad_cuotas FROM cursos ORDER BY id DESC'
      );
      return rows;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los cursos');
    }
  }

  async crearCurso(datos: { nombre: string; monto_inicial: number; monto_cuota: number; cantidad_cuotas: number }) {
    try {
      const [result]: any = await this.pool.execute(
        'INSERT INTO cursos (nombre, monto_inicial, monto_cuota, cantidad_cuotas) VALUES (?, ?, ?, ?)',
        [datos.nombre, datos.monto_inicial, datos.monto_cuota, datos.cantidad_cuotas]
      );
      return { success: true, id: result.insertId, message: 'Curso configurado exitosamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el curso');
    }
  }
  
  async obtenerEstadoCuenta(estudianteId: number) {
    // Este método expande la vista financiera: cruza inscripciones, cursos y deuda
    const query = `
      SELECT c.nombre as curso, cf.tipo, cf.numero_cuota, cf.monto_esperado, cf.fecha_vencimiento, cf.estado
      FROM cargos_financieros cf
      JOIN inscripciones i ON cf.inscripcion_id = i.id
      JOIN cursos c ON i.curso_id = c.id
      WHERE i.estudiante_id = ?
      ORDER BY cf.fecha_vencimiento ASC
    `;
    const [rows] = await this.pool.execute(query, [estudianteId]);
    return rows;
  }
  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
