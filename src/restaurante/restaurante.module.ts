/*
https://docs.nestjs.com/modules
*/

import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import * as sqliteStore from 'cache-manager-sqlite';
import { RestauranteResolver } from './restaurante.resolver';

@Module({
  imports: [
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      },
    }),
    TypeOrmModule.forFeature([RestauranteEntity]),
    CacheModule.register()
  ],
  providers: [RestauranteService, RestauranteResolver],
  controllers: [RestauranteController]
})
export class RestauranteModule { }
