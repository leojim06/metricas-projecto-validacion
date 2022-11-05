import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaResolver } from '../cultura-gastronomica/cultura-gastronomica.resolver';

@Injectable()
export class CulturaGastronomicaService {

  cacheKey: string = "culturas";

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async obtenerTodos(): Promise<CulturaGastronomicaEntity[]> {
    const cached: CulturaGastronomicaEntity[] = await this.cacheManager
      .get<CulturaGastronomicaEntity[]>(this.cacheKey);

    if (!cached) {
      const culturasGastronomicas: CulturaGastronomicaEntity[] = await this.culturaGastronomicaRepository
        .find({ relations: ['recetas', 'productos'], });
      await this.cacheManager.set(this.cacheKey, culturasGastronomicas);
      return culturasGastronomicas;
    }

    return cached;
  }

  async obtenerPorId(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoUno(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoUno(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoDos(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoTres(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoCuatro(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async obtenerPorIdDuplicadoCinco(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['recetas', 'productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async crear(
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async actualizar(
    id: string,
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomicaGuardada: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({ where: { id } });
    if (!culturaGastronomicaGuardada)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.id = id;

    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async borrar(id: string) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({ where: { id } });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    await this.culturaGastronomicaRepository.remove(culturaGastronomica);
  }
}
