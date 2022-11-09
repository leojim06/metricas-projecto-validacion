import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';
import { CulturaGastronomicaService } from '../cultura-gastronomica/cultura-gastronomica.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5,
    },
  }),],
  providers: [RecetaService, RecetaResolver, CulturaGastronomicaService],
  controllers: [RecetaController],
})
export class RecetaModule {}
