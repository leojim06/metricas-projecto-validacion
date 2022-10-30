import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaService } from '../cultura-gastronomica/cultura-gastronomica.service';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaResolver } from './cultura-gastronomica.resolver';

@Module({
  imports: [
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      },
    }),
    TypeOrmModule.forFeature([CulturaGastronomicaEntity]),
  ],
  providers: [CulturaGastronomicaService, CulturaGastronomicaResolver ],
  controllers: [CulturaGastronomicaController],
})
export class CulturaGastronomicaModule { }
