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
import { Role } from '../shared/security/role';
import { HasRoles } from '../shared/decorator/hasroles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { PaisDto } from  '../pais/pais.dto';
import { PaisEntity } from '../pais/pais.entity';
import { plainToInstance } from 'class-transformer';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaPaisController {
  constructor(
    private readonly culturaGastronomicaPaisService: CulturaGastronomicaPaisService,
  ) { }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':culturaGastronomicaId/paises/:paisId')
  async agregarPaisCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturaGastronomicaPaisService.agregarPaisCulturaGastronomica(
      culturaGastronomicaId,
      paisId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/paises/:paisId')
  async buscarPaisPorCulturaGastronomicaIdPaisId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturaGastronomicaPaisService.buscarPaisPorCulturaGastronomicaIdPaisId(
      culturaGastronomicaId,
      paisId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/paises')
  async buscarPaisesPorCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaPaisService.buscarPaisesPorCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':culturaGastronomicaId/paises')
  async asociarPaisesCulturaGastronomica(
    @Body() paisesDto: PaisDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const paises = plainToInstance(PaisEntity, paisesDto);
    return await this.culturaGastronomicaPaisService.asociarPaisesCulturaGastronomica(
      culturaGastronomicaId,
      paises,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':culturaGastronomicaId/paises/:paisId')
  @HttpCode(204)
  async borrarRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturaGastronomicaPaisService.borrarPaisCulturaGastronomica(
      culturaGastronomicaId,
      paisId,
    );
  }
}
