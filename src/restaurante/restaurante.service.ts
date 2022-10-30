import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { RestauranteEntity } from './restaurante.entity';

@Injectable()
export class RestauranteService {

  cacheKey: string = "restaurantes";

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly RestauranteRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async obtenerTodos(): Promise<RestauranteEntity[]> {
    const cached: RestauranteEntity[] = await this.cacheManager
    .get<RestauranteEntity[]>(this.cacheKey);

    if (!cached) {
      const restaurantes: RestauranteEntity[] = await this.RestauranteRepository
        .find();
      await this.cacheManager.set(this.cacheKey, restaurantes);
      return restaurantes;
    }
    return cached;
  }

  async obtenerPorId(id: string): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.RestauranteRepository.findOne({ where: { id } });
    if (!restaurante)
      throw new BusinessLogicException(
        'No se encontró el restaurante con el id indicado',
        BusinessError.NOT_FOUND,
      );
    return restaurante;
  }

  async crear(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.RestauranteRepository.save(restaurante);
  }

  async actualizar(
    id: string,
    restaurante: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    const restauranteActualizada: RestauranteEntity =
      await this.RestauranteRepository.findOne({ where: { id } });
    if (!restauranteActualizada)
      throw new BusinessLogicException(
        'No se encontró el restaurante con el id indicado',
        BusinessError.NOT_FOUND,
      );

    restaurante.id = id;

    return await this.RestauranteRepository.save(restaurante);
  }

  async eliminar(id: string) {
    const restaurante: RestauranteEntity =
      await this.RestauranteRepository.findOne({ where: { id } });
    if (!restaurante)
      throw new BusinessLogicException(
        'No se encontró la restaurante con el id indicado',
        BusinessError.NOT_FOUND,
      );

    await this.RestauranteRepository.remove(restaurante);
  }
}
