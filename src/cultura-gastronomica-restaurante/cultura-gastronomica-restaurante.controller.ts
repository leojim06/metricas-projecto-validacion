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
import { RestauranteDto } from './../restaurante/resturante.dto';
import { RestauranteEntity } from './../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { HasRoles } from '../shared/decorator/hasroles.decorator';
import { Role } from '../shared/security/role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRestauranteController {
  constructor(
    private readonly culturaGastronomicaRestauranteService: CulturaGastronomicaRestauranteService,
  ) {}

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':culturaGastronomicaId/restaurantes/:restauranteId')
  async agregarRestauranteCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaGastronomicaRestauranteService.agregarRestauranteCulturaGastronomica(
      culturaGastronomicaId,
      restauranteId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/restaurantes/:restauranteId')
  async buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaGastronomicaRestauranteService.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
      culturaGastronomicaId,
      restauranteId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/restaurantes')
  async buscarRestaurantesPorCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaRestauranteService.buscarRestaurantesPorCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':culturaGastronomicaId/restaurantes')
  async asociarRestauranteCulturaGastronomica(
    @Body() restaurantesDto: RestauranteDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
    return await this.culturaGastronomicaRestauranteService.asociarRestaurantesCulturaGastronomica(
      culturaGastronomicaId,
      restaurantes,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':culturaGastronomicaId/restaurantes/:restauranteId')
  @HttpCode(204)
  async eliminarRestauranteCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaGastronomicaRestauranteService.eliminarRestauranteCulturaGastronomica(
      culturaGastronomicaId,
      restauranteId,
    );
  }
}
