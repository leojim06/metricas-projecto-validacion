import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ProductoDto {
  @Field()
  @IsString()
  readonly id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly historia: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly idCategoria: string;
}
