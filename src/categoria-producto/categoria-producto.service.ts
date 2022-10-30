import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';

@Injectable()
export class CategoriaProductoService {
  constructor(
    @InjectRepository(CategoriaProductoEntity)
    private readonly categoriaProductoRepository: Repository<CategoriaProductoEntity>,
  ) {}

  async findAll(): Promise<CategoriaProductoEntity[]> {
    return await this.categoriaProductoRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<CategoriaProductoEntity> {
    const categoriaProducto: CategoriaProductoEntity =
      await this.categoriaProductoRepository.findOne({
        where: { id },
        relations: ['productos'],
      });
    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'No se encontró la categoría de producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    return categoriaProducto;
  }

  async create(
    categoriaProducto: CategoriaProductoEntity,
  ): Promise<CategoriaProductoEntity> {
    return await this.categoriaProductoRepository.save(categoriaProducto);
  }

  async update(
    id: string,
    categoriaProducto: CategoriaProductoEntity,
  ): Promise<CategoriaProductoEntity> {
    const persistedCategoriaProducto: CategoriaProductoEntity =
      await this.categoriaProductoRepository.findOne({ where: { id } });
    if (!persistedCategoriaProducto) {
      throw new BusinessLogicException(
        'No se encontró la categoría de producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.categoriaProductoRepository.save({
      ...persistedCategoriaProducto,
      ...categoriaProducto,
    });
  }

  async delete(id: string) {
    const categoriaProducto: CategoriaProductoEntity =
      await this.categoriaProductoRepository.findOne({
        where: { id },
      });
    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'No se encontró la categoría de producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.categoriaProductoRepository.remove(categoriaProducto);
  }
}
