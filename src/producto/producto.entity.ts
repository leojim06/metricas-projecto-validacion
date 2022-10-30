import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  historia: string;

  @Field(() => CategoriaProductoEntity)
  @ManyToOne(
    () => CategoriaProductoEntity,
    (categoriaProducto) => categoriaProducto.productos,
  )
  categoriaProducto: CategoriaProductoEntity;

  @Field(() => [CulturaGastronomicaEntity])
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.productos,
  )
  culturasGastronomicas?: CulturaGastronomicaEntity[];
}
