import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaisDto {

  @Field()
  @IsString()
  readonly id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
