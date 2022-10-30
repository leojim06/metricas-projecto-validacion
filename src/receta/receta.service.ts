import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { RecetaEntity } from './receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RecetaService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly RecetaRepository: Repository<RecetaEntity>,
  ) {}

  async obtenerTodos(): Promise<RecetaEntity[]> {
    return await this.RecetaRepository.find({});
  }

  async obtenerPorId(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.RecetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );
    return receta;
  }

  async crear(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.RecetaRepository.save(receta);
  }

  async actualizar(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
    const recetaActualizada: RecetaEntity = await this.RecetaRepository.findOne(
      { where: { id } },
    );
    if (!recetaActualizada)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );

    receta.id = id;

    return await this.RecetaRepository.save(receta);
  }

  async borrar(id: string) {
    const receta: RecetaEntity = await this.RecetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No se encontró la receta con el id indicado',
        BusinessError.NOT_FOUND,
      );

    await this.RecetaRepository.remove(receta);
  }
}
