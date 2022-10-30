import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CategoriaProductoDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
