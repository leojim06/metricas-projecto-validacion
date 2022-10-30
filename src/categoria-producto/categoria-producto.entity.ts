import { ProductoEntity } from '../producto/producto.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaProductoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(() => [ProductoEntity])
  @OneToMany(() => ProductoEntity, (producto) => producto.categoriaProducto)
  productos?: ProductoEntity[];
}
