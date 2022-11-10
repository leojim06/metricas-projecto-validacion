import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  ciudad: string;

  @Field()
  @Column()
  estrellasMichelin: number;

  @Field()
  @Column()
  anioConsecucionEstrellaMichelin: number;
  
  @Field(type => CulturaGastronomicaEntity, {nullable: true})
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.restaurantes,
  )

  culturasGastronomicas?: CulturaGastronomicaEntity[];
}
