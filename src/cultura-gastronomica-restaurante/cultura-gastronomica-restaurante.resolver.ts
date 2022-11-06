import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteDto } from '../restaurante/resturante.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CulturaGastronomicaRestauranteResolver {
  constructor(
    private culturaGastronomicaRestauranteService: CulturaGastronomicaRestauranteService,
  ) {}

  @Mutation(() => [RestauranteEntity])
  buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('restauranteId') restauranteId: string,
  ): Promise<RestauranteEntity> {
    return this.culturaGastronomicaRestauranteService.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
      culturaGastronomicaId,
      restauranteId,
    );
  }

  @Mutation(() => [RestauranteEntity])
  buscarRestaurantesPorCulturaGastronomicaId(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
  ): Promise<RestauranteEntity[]> {
    return this.culturaGastronomicaRestauranteService.buscarRestaurantesPorCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @Mutation(() => [CulturaGastronomicaEntity])
  agregarRestauranteCulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('restauranteId') restauranteId: string,
  ): Promise<CulturaGastronomicaEntity> {
    return this.culturaGastronomicaRestauranteService.agregarRestauranteCulturaGastronomica(
      culturaGastronomicaId,
      restauranteId,
    );
  }

  @Mutation(() => [CulturaGastronomicaEntity])
  asociarRestaurantesCulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args({ name: 'restaurantes', type: () => [RestauranteDto] })
    restaurantesDto: RestauranteDto[],
  ): Promise<CulturaGastronomicaEntity> {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
    return this.culturaGastronomicaRestauranteService.asociarRestaurantesCulturaGastronomica(
      culturaGastronomicaId,
      restaurantes,
    );
  }

  @Mutation(() => [RestauranteEntity])
  eliminarRestauranteCulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('restauranteId') restauranteId: string,
  ) {
    return this.culturaGastronomicaRestauranteService.eliminarRestauranteCulturaGastronomica(
      culturaGastronomicaId,
      restauranteId,
    );
  }
}
