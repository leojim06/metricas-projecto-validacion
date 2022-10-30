import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
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
  instruccionesPreparacion: string;

  @Field()
  @Column()
  foto: string;

  @Field()
  @Column()
  video: string;

  @Field(type => CulturaGastronomicaEntity)
  @ManyToOne(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.recetas,
  )
  culturaGastronomica?: CulturaGastronomicaEntity;
}
