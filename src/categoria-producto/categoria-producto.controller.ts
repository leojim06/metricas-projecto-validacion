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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/role';
import { CategoriaProductoDto } from './categoria-producto.dto';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('categoria-producto')
export class CategoriaProductoController {
  constructor(
    private readonly categoriaProductoService: CategoriaProductoService,
  ) {}

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.categoriaProductoService.findAll();
  }

  @HasRoles(Role.READ, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':categoriaProductoId')
  async findOne(@Param('categoriaProductoId') categoriaProductoId: string) {
    return await this.categoriaProductoService.findOne(categoriaProductoId);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() categoriaProductoDto: CategoriaProductoDto) {
    const categoriaProducto: CategoriaProductoEntity = plainToInstance(
      CategoriaProductoEntity,
      categoriaProductoDto,
    );
    return await this.categoriaProductoService.create(categoriaProducto);
  }

  @HasRoles(Role.WRITE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':categoriaProductoId')
  async update(
    @Param('categoriaProductoId') categoriaProductoId: string,
    @Body() categoriaProductoDto: CategoriaProductoDto,
  ) {
    const categoriaProducto: CategoriaProductoEntity = plainToInstance(
      CategoriaProductoEntity,
      categoriaProductoDto,
    );
    return await this.categoriaProductoService.update(
      categoriaProductoId,
      categoriaProducto,
    );
  }

  @HasRoles(Role.DELETE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':categoriaProductoId')
  @HttpCode(204)
  async delete(@Param('categoriaProductoId') categoriaProductoId: string) {
    return await this.categoriaProductoService.delete(categoriaProductoId);
  }
}
