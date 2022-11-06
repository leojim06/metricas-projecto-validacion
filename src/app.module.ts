import { CategoriaProductoModule } from './categoria-producto/categoria-producto.module';
import { ProductoModule } from './producto/producto.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CulturaGastronomicaEntity } from './cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { RecetaModule } from './receta/receta.module';
import { PaisModule } from './pais/pais.module';
import { PaisEntity } from './pais/pais.entity';
import { RecetaEntity } from './receta/receta.entity';
import { CategoriaProductoEntity } from './categoria-producto/categoria-producto.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { ProductoEntity } from './producto/producto.entity';
import { CulturaGastronomicaRecetaModule } from './cultura-gastronomica-receta/cultura-gastronomica-receta.module';
import { CulturaGastronomicaPaisModule } from './cultura-gastronomica-pais/cultura-gastronomica-pais.module';
import { CulturaGastronomicaProductoModule } from './cultura-gastronomica-producto/cultura-gastronomica-producto.module';
import { CulturaGastronomicaRestauranteModule } from './cultura-gastronomica-restaurante/cultura-gastronomica-restaurante.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [
        CulturaGastronomicaEntity,
        ProductoEntity,
        CategoriaProductoEntity,
        RecetaEntity,
        RestauranteEntity,
        PaisEntity,
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CategoriaProductoModule,
    CulturaGastronomicaModule,
    CulturaGastronomicaPaisModule,
    CulturaGastronomicaProductoModule,
    CulturaGastronomicaRestauranteModule,
    CulturaGastronomicaRecetaModule,
    PaisModule,
    ProductoModule,
    RecetaModule,
    RestauranteModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
