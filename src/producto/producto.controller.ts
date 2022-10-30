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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriaProductoService } from '../categoria-producto/categoria-producto.service';
import { HasRoles } from '../shared/decorator/hasroles.decorator';
import { Role } from '../shared/security/role';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly categoriaProductoService: CategoriaProductoService,
  ) {}

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const categoriaProducto = await this.categoriaProductoService.findOne(
      productoDto.idCategoria,
    );
    const producto: ProductoEntity = {
      id: undefined,
      nombre: productoDto.nombre,
      descripcion: productoDto.descripcion,
      historia: productoDto.historia,
      categoriaProducto: categoriaProducto,
    };
    return await this.productoService.create(producto);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':productoId')
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDto,
  ) {
    const categoriaProducto = await this.categoriaProductoService.findOne(
      productoDto.idCategoria,
    );
    const producto: ProductoEntity = {
      id: productoId,
      nombre: productoDto.nombre,
      descripcion: productoDto.descripcion,
      historia: productoDto.historia,
      categoriaProducto: categoriaProducto,
    };
    return await this.productoService.update(productoId, producto);
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
