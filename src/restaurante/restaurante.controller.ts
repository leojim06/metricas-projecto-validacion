import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Param,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './resturante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasRoles } from '../shared/decorator/hasroles.decorator';
import { Role } from '../shared/security/role';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @HasRoles(Role.READ, Role.ADMIN, Role.READ_RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async obtenerTodos() {
    return await this.restauranteService.obtenerTodos();
  }

  @HasRoles(Role.READ, Role.ADMIN, Role.READ_RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':restauranteId')
  async obtenerRestaurante(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.obtenerPorId(restauranteId);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async crear(@Body() restauranteDto: RestauranteDto) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.crear(restaurante);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':restauranteId')
  async actualizar(
    @Param('restauranteId') restauranteId: string,
    @Body() restauranteDto: RestauranteDto,
  ) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.actualizar(restauranteId, restaurante);
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':restauranteId')
  @HttpCode(204)
  async elminar(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.eliminar(restauranteId);
  }
}
