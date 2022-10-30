import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestauranteService } from './restaurante.service';
import { RestauranteDto } from './resturante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class RestauranteResolver {
    constructor(private restauranteService: RestauranteService) {}

    @Query(() => [RestauranteEntity])
    restaurantes(): Promise<RestauranteEntity[]> {
        return this.restauranteService.obtenerTodos();
    }

    @Query(() => RestauranteEntity)
    restaurante(@Args('id') id: string): Promise<RestauranteEntity> {
        return this.restauranteService.obtenerPorId(id);
    }
   
    @Mutation(() => RestauranteEntity)
    crearRestaurante(@Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
       const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
       return this.restauranteService.crear(restaurante);
   }

    @Mutation(() => RestauranteEntity)
    actualizarRestaurante(@Args('id') id: string, @Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
       const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
       return this.restauranteService.actualizar(id, restaurante);
    }

    @Mutation(() => String)
    eliminarRestaurante(@Args('id') id: string) {
       this.restauranteService.eliminar(id);
       return id;
    }
}
