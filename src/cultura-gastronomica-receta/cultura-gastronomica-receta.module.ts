import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { CulturaGastronomicaRecetaController } from './cultura-gastronomica-receta.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      },
    }),
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity]),
  ],
  providers: [CulturaGastronomicaRecetaService],
  controllers: [CulturaGastronomicaRecetaController],
})
export class CulturaGastronomicaRecetaModule {}
