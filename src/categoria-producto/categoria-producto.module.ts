/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';
import { CategoriaProductoController } from './categoria-producto.controller';
import { CategoriaProductoResolver } from './categoria-producto.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaProductoEntity])],
  controllers: [CategoriaProductoController],
  providers: [CategoriaProductoService, CategoriaProductoResolver],
})
export class CategoriaProductoModule {}
