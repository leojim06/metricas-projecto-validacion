import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaGastronomicaPaisService {
  cacheKey = 'cultura-paises';
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async agregarPaisCulturaGastronomica(
    culturaGastronomicaId: string,
    paisId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['paises'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais)
      throw new BusinessLogicException(
        'No se encontró el país con el id indicado',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.paises = [...culturaGastronomica.paises, pais];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async buscarPaisPorCulturaGastronomicaIdPaisId(
    culturaGastronomicaId: string,
    paisId: string,
  ): Promise<PaisEntity> {

    const cached: PaisEntity = await this.cacheManager.get<PaisEntity>(this.cacheKey);

    if (!cached) {
      const pais: PaisEntity =
        await this.paisRepository.findOne({
          where: { id: paisId },
        });

      await this.cacheManager.set(this.cacheKey, pais);

      if (!pais)
        throw new BusinessLogicException(
          'No se encontró el país con el id indicado',
          BusinessError.NOT_FOUND,
        );

      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['paises'],
        });
      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id indicado',
          BusinessError.NOT_FOUND,
        );

      const paisCulturaGastronomica: PaisEntity = culturaGastronomica.paises.find(
        (r) => r.id === pais.id,
      );
      if (!paisCulturaGastronomica)
        throw new BusinessLogicException(
          'El país no está relacionada a la cultura gastronómica',
          BusinessError.PRECONDITION_FAILED,
        );

      return paisCulturaGastronomica;
    }
    return cached
  }

  async buscarPaisesPorCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<PaisEntity[]> {

    const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey);
    if (!cached) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['paises'],
        });
      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id indicado',
          BusinessError.NOT_FOUND,
        );
      await this.cacheManager.set(this.cacheKey, culturaGastronomica.paises);
      return culturaGastronomica.paises;
    }
    return cached;
  }

  async asociarPaisesCulturaGastronomica(
    culturaGastronomicaId: string,
    paises: PaisEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['paises'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < paises.length; i++) {
      const pais: PaisEntity = await this.paisRepository.findOne({
        where: { id: `${paises[i].id}` },
      });
      if (!pais)
        throw new BusinessLogicException(
          'No se encontró el país con el id indicado',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.paises = paises;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async borrarPaisCulturaGastronomica(
    culturaGastronomicaId: string,
    paisId: string,
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['paises'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais)
      throw new BusinessLogicException(
        'No se encontró el país con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const paisCulturaGastronomica: PaisEntity = culturaGastronomica.paises.find(
      (r) => r.id === pais.id,
    );
    if (!paisCulturaGastronomica)
      throw new BusinessLogicException(
        'El país no está relacionada a la cultura gastronómica',
        BusinessError.PRECONDITION_FAILED,
      );

    culturaGastronomica.paises = culturaGastronomica.paises.filter(
      (r) => r.id !== paisId,
    );
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
