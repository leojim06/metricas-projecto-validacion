import { CacheModule, Module } from '@nestjs/common';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaPaisController } from './cultura-gastronomica-pais.controller';
import { CulturaGastronomicaPaisResolver } from './cultura-gastronomica-pais.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, PaisEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5,
    },
  }),
  ],
  providers: [CulturaGastronomicaPaisService, CulturaGastronomicaPaisResolver],
  controllers: [CulturaGastronomicaPaisController],
})
export class CulturaGastronomicaPaisModule {}
