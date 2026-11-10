import { Controller, Get, Post, Body,  Param, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

   @Post()
  crearCurso(@Body() body: any) {
    return this.coursesService.crearCurso(body);
  }
  @Get()
  listarCursos() {
    return this.coursesService.obtenerTodos();
  }

  @Get('statement/:estudianteId')
  estadoCuenta(@Param('estudianteId') estudianteId: string) {
    return this.coursesService.obtenerEstadoCuenta(Number(estudianteId));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
