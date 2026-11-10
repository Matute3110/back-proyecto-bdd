import { Injectable, Inject} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import type { Pool, PoolConnection } from 'mysql2/promise';

@Injectable()
export class StudentsService {
  
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async obtenerTodos() {
    const [rows] = await this.pool.query('SELECT * FROM estudiantes ORDER BY id DESC');
    return rows;
  }

  async crear(datos: { cedula: string; nombre: string; apellidos: string }) {
    const [result]: any = await this.pool.execute(
      'INSERT INTO estudiantes (cedula, nombre, apellidos) VALUES (?, ?, ?)',
      [datos.cedula, datos.nombre, datos.apellidos]
    );
    return { success: true, id: result.insertId };
  }
  
  async buscarPorNombre(query: string) {
    const searchTerm = `%${query}%`;
    const [rows] = await this.pool.execute(
      'SELECT * FROM estudiantes WHERE nombre LIKE ? OR apellidos LIKE ? OR cedula LIKE ?',
      [searchTerm, searchTerm, searchTerm]
    );
    return rows;
  }

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll() {
    return `This action returns all students`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
