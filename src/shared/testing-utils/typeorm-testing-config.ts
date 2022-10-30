import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from '../../categoria-producto/categoria-producto.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { CulturaGastronomicaEntity } from '../../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulturaGastronomicaEntity,
      CategoriaProductoEntity,
      ProductoEntity,
      RecetaEntity,
      PaisEntity,
      RestauranteEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulturaGastronomicaEntity,
    CategoriaProductoEntity,
    ProductoEntity,
    RecetaEntity,
    PaisEntity,
    RestauranteEntity,
  ]),
];

