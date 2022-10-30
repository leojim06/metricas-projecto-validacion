import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PaisEntity } from './pais.entity';

@Injectable()
export class PaisService {
  cacheKey: string = "paises";

  constructor(
    @InjectRepository(PaisEntity)
    private readonly PaisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async obtenerTodos(): Promise<PaisEntity[]> {
    const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey);
    if (!cached) {
      const paises: PaisEntity[] = await this.PaisRepository.find();
      await this.cacheManager.set(this.cacheKey, paises);
      return paises;
    }
    return cached;
  }

  async obtenerPorId(id: string): Promise<PaisEntity> {
    const pais: PaisEntity = await this.PaisRepository.findOne({
      where: { id },
    });
    if (!pais)
      throw new BusinessLogicException(
        'No se encontró el país con el id indicado',
        BusinessError.NOT_FOUND,
      );
    return pais;
  }

  async crear(pais: PaisEntity): Promise<PaisEntity> {
    return await this.PaisRepository.save(pais);
  }

  async actualizar(id: string, pais: PaisEntity): Promise<PaisEntity> {
    const paisActualizado: PaisEntity = await this.PaisRepository.findOne({
      where: { id },
    });
    if (!paisActualizado)
      throw new BusinessLogicException(
        'No se encontró el país con el id indicado',
        BusinessError.NOT_FOUND,
      );

    pais.id = id;

    return await this.PaisRepository.save(pais);
  }

  async borrar(id: string) {
    const pais: PaisEntity = await this.PaisRepository.findOne({
      where: { id },
    });
    if (!pais)
      throw new BusinessLogicException(
        'No se encontró el país con el id indicado',
        BusinessError.NOT_FOUND,
      );

    await this.PaisRepository.remove(pais);
  }
}
