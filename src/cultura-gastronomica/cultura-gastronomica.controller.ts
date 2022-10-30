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
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaController {
  constructor(
    private readonly culturaGastronomicaService: CulturaGastronomicaService,
  ) {}

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async obtenerTodos() {
    return await this.culturaGastronomicaService.obtenerTodos();
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId')
  async findOne(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.culturaGastronomicaService.obtenerPorId(
      culturaGastronomicaId,
    );
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
    const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturaGastronomicaDto,
    );
    return await this.culturaGastronomicaService.crear(culturaGastronomica);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':culturaGastronomicaId')
  async update(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Body() culturaGastronomicaDto: CulturaGastronomicaDto,
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturaGastronomicaDto,
    );
    return await this.culturaGastronomicaService.actualizar(
      culturaGastronomicaId,
      culturaGastronomica,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':culturaGastronomicaId')
  @HttpCode(204)
  async delete(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return this.culturaGastronomicaService.borrar(culturaGastronomicaId);
  }
}
