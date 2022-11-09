/*
https://docs.nestjs.com/modules
*/

import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { CategoriaProductoService } from '../categoria-producto/categoria-producto.service';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { ProductoResolver } from './producto.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoEntity, CategoriaProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5,
      },
    }),
  ],
  controllers: [ProductoController],
  providers: [ProductoService, CategoriaProductoService, ProductoResolver],
})
export class ProductoModule { }
