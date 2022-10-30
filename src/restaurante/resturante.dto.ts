import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class RestauranteDto {

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  readonly estrellasMichelin: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  readonly anioConsecucionEstrellaMichelin: number;
}
