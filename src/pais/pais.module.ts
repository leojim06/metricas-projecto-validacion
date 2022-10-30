import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5
    },
  }),
  ],
  providers: [PaisService, PaisResolver],
  controllers: [PaisController],
})
export class PaisModule {}
