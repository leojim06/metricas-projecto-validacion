import { ProductoEntity } from '../producto/producto.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field((type) => [RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.culturaGastronomica)
  recetas: RecetaEntity[];

  @Field(() => [ProductoEntity])
  @ManyToMany(
    () => ProductoEntity,
    (producto) => producto.culturasGastronomicas,
  )
  @JoinTable()
  productos?: ProductoEntity[];

  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.culturasGastronomicas,
  )
  @JoinTable()
  restaurantes?: RestauranteEntity[];

  @ManyToMany(() => PaisEntity, (pais) => pais.culturasGastronomicas)
  @JoinTable()
  paises: PaisEntity[];
}
