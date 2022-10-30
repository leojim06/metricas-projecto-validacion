import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { CulturaGastronomicaProductoController } from './cultura-gastronomica-producto.controller';
import { CulturaGastronomicaProductoResolver } from './cultura-gastronomica-producto.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5,
      },
    }),
  ],
  providers: [
    CulturaGastronomicaProductoService,
    CulturaGastronomicaProductoResolver,
  ],
  controllers: [CulturaGastronomicaProductoController],
})
export class CulturaGastronomicaProductoModule {}
