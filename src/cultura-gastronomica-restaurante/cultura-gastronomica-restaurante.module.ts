import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaRestauranteController } from './cultura-gastronomica-restaurante.controller';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaRestauranteResolver } from './cultura-gastronomica-restaurante.resolver';

@Module({
  imports: [
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      },
    }),
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity]),
  ],
  providers: [CulturaGastronomicaRestauranteService, CulturaGastronomicaRestauranteResolver],
  controllers: [CulturaGastronomicaRestauranteController]
})

export class CulturaGastronomicaRestauranteModule { }
