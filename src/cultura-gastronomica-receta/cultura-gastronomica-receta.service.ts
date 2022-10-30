import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaRecetaService {
  cultura: string = 'cultura-gastronomica-id';
  listaRecetas: string = 'recetas-cultura-gastronomica';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async agregarRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async buscarRecetaPorCulturaGastronomicaIdRecetaId(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const recetaCulturaGastronomica: RecetaEntity =
      culturaGastronomica.recetas.find((r) => r.id === receta.id);
    if (!recetaCulturaGastronomica)
      throw new BusinessLogicException(
        'La receta no está relacionada a la cultura gastronómica',
        BusinessError.PRECONDITION_FAILED,
      );

    return recetaCulturaGastronomica;
  }

  async buscarRecetasPorCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<RecetaEntity[]> {
    const culturaGuardada: string = await this.cacheManager.get<string>(this.cultura);
    const recetasGuardadas: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.listaRecetas);

    if (culturaGuardada && culturaGuardada === culturaGastronomicaId && recetasGuardadas) {
      return recetasGuardadas;
    } else {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['recetas'],
        });
      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id indicado',
          BusinessError.NOT_FOUND,
        );

      await this.cacheManager.set(this.cultura, culturaGastronomicaId);
      await this.cacheManager.set(this.listaRecetas, culturaGastronomica.recetas);
      return culturaGastronomica.recetas;
    }
  }

  async asociarRecetasCulturaGastronomica(
    culturaGastronomicaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: `${recetas[i].id}` },
      });
      if (!receta)
        throw new BusinessLogicException(
          'No se encontró la receta con el id indicado',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.recetas = recetas;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async borrarRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );

    const recetaCulturaGastronomica: RecetaEntity =
      culturaGastronomica.recetas.find((r) => r.id === receta.id);
    if (!recetaCulturaGastronomica)
      throw new BusinessLogicException(
        'La receta no está relacionada a la cultura gastronómica',
        BusinessError.PRECONDITION_FAILED,
      );

    culturaGastronomica.recetas = culturaGastronomica.recetas.filter(
      (r) => r.id !== recetaId,
    );
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
