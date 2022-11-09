import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { IGetProduct, IProduct } from 'src/producto/product.interface';
import products from "../producto/product.data";


@Injectable()
export class CulturaGastronomicaRestauranteService {
  cacheKey: string = 'culturas-gastronomicas';
  existe: boolean;
  
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async agregarRestauranteCulturaGastronomica(
    culturaGastronomicaId: string,
    restauranteId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['restaurantes'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante)
      throw new BusinessLogicException(
        'No se encontró la restaurante con el id indicado',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.restaurantes = [
      ...culturaGastronomica.restaurantes,
      restaurante,
    ];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
    culturaGastronomicaId: string,
    restauranteId: string,
  ): Promise<RestauranteEntity> {
    const cached: RestauranteEntity =
      await this.cacheManager.get<RestauranteEntity>(this.cacheKey);

    if (!cached) {
      const restaurante: RestauranteEntity =
        await this.restauranteRepository.findOne({
          where: { id: restauranteId },
        });

      await this.cacheManager.set(this.cacheKey, restaurante);

      if (!restaurante)
        throw new BusinessLogicException(
          'No se encontró la restaurante con el id indicado',
          BusinessError.NOT_FOUND,
        );

      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['restaurantes'],
        });

      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id indicado',
          BusinessError.NOT_FOUND,
        );

      const restauranteCulturaGastronomica: RestauranteEntity =
        culturaGastronomica.restaurantes.find((r) => r.id === restaurante.id);
      if (!restauranteCulturaGastronomica)
        throw new BusinessLogicException(
          'La restaurante no está relacionada a la cultura gastronómica',
          BusinessError.NOT_FOUND,
        );

      return restauranteCulturaGastronomica;
    }
    return cached;
  }

  async buscarRestaurantesPorCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<RestauranteEntity[]> {
    const cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(this.cacheKey);

    if (!cached) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['restaurantes'],
        });
      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id indicado',
          BusinessError.NOT_FOUND,
        );
      return culturaGastronomica.restaurantes;
    }
    return cached;
  }

  async asociarRestaurantesCulturaGastronomica(
    culturaGastronomicaId: string,
    restaurantes: RestauranteEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['restaurantes'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    for (let r of restaurantes) {
      const restaurante: RestauranteEntity =
        await this.restauranteRepository.findOne({
          where: { id: r.id },
        });
      if (!restaurante)
        throw new BusinessLogicException(
          'No se encontró la restaurante con el id indicado',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.restaurantes = restaurantes;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async eliminarRestauranteCulturaGastronomica(
    culturaGastronomicaId: string,
    restauranteId: string,
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['restaurantes'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante)
      throw new BusinessLogicException(
        'No se encontró la restaurante con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const restauranteCulturaGastronomica: RestauranteEntity =
      culturaGastronomica.restaurantes.find((r) => r.id === restaurante.id);
    if (!restauranteCulturaGastronomica)
      throw new BusinessLogicException(
        'La restaurante no está relacionada a la cultura gastronómica',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.restaurantes = culturaGastronomica.restaurantes.filter(
      (r) => r.id !== restauranteId,
    );
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }


  delete({ id }: IGetProduct): boolean {

    products.forEach(product => {
      if(product.id !== id){
        this.existe = true;
      }else{
        this.existe = false;
      }
    });
      return this.existe;
  }
}
