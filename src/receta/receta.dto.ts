import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class RecetaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  instruccionesPreparacion: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  foto: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  video: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly idCulturaGastronomica?: string;
}
