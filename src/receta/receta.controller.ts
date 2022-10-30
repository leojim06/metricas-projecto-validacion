import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasRoles } from '../shared/decorator/hasroles.decorator';
import { Role } from '../shared/security/role';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async obtenerTodos() {
    return await this.recetaService.obtenerTodos();
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':recetaId')
  async obtenerReceta(@Param('recetaId') recetaId: string) {
    return await this.recetaService.obtenerPorId(recetaId);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.crear(receta);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':recetaId')
  async actualizar(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.actualizar(recetaId, receta);
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':recetaId')
  @HttpCode(204)
  async eliminar(@Param('recetaId') recetaId: string) {
    return await this.recetaService.borrar(recetaId);
  }
}
