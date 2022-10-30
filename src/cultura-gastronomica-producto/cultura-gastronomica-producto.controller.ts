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
import { HasRoles } from 'src/shared/decorator/hasroles.decorator';
import { Role } from 'src/shared/security/role';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaProductoController {
  constructor(
    private readonly culturaGastronomicaService: CulturaGastronomicaProductoService,
  ) {}

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':culturaGastronomicaId/productos/:productoId')
  async adicionarProductoACulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastronomicaService.adicionarProductoACulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/productos/:productoId')
  async obtenerProductoPorIdCulturaGastronomicaYIdProducto(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastronomicaService.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
      culturaGastronomicaId,
      productoId,
    );
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':culturaGastronomicaId/productos')
  async obtenerProductosPorIdCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaService.obtenerProductosPorIdCulturaGastronomica(
      culturaGastronomicaId,
    );
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':culturaGastronomicaId/productos')
  async asociarProductosCulturaGastronomica(
    @Body() productosDto: ProductoDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.culturaGastronomicaService.asociarProductosCulturaGastronomica(
      culturaGastronomicaId,
      productos,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':culturaGastronomicaId/productos/:productoId')
  @HttpCode(204)
  async deleteArtworkMuseum(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastronomicaService.eliminarProductoCulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }
}
