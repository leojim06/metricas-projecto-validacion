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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RecetaDto } from 'src/receta/receta.dto';
import { RecetaEntity } from 'src/receta/receta.entity';
import { HasRoles } from 'src/shared/decorator/hasroles.decorator';
import { Role } from 'src/shared/security/role';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRecetaController {
  constructor(
    private readonly culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService,
  ) {}

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':culturaGastronomicaId/recetas/:recetaId')
  async agregarRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.agregarRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/recetas/:recetaId')
  async buscarRecetaPorCulturaGastronomicaIdRecetaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.buscarRecetaPorCulturaGastronomicaIdRecetaId(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/recetas')
  async buscarRecetasPorCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.buscarRecetasPorCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':culturaGastronomicaId/recetas')
  async asociarRecetasCulturaGastronomica(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaGastronomicaRecetaService.asociarRecetasCulturaGastronomica(
      culturaGastronomicaId,
      recetas,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':culturaGastronomicaId/recetas/:recetaId')
  @HttpCode(204)
  async borrarRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.borrarRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }
}
