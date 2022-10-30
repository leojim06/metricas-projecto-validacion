import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProductoEntity } from './producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';

@Injectable()
export class ProductoService {
  cacheKey = 'productos';
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(CategoriaProductoEntity)
    private readonly categoriaProductoRepository: Repository<CategoriaProductoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);
    if (!cached) {
      const productos = this.productoRepository.find({
        relations: ['categoriaProducto', 'culturasGastronomicas'],
      });
      await this.cacheManager.set(this.cacheKey, productos);
      return productos;
    }
    return cached;
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoriaProducto', 'culturasGastronomicas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        'No se encontró el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    const categoriaProducto: CategoriaProductoEntity =
      await this.categoriaProductoRepository.findOne({
        where: { id: `${producto.categoriaProducto.id}` },
      });
    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'No se encontró la categoría de producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    producto.categoriaProducto = categoriaProducto;
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({ where: { id } });
    if (!persistedProducto) {
      throw new BusinessLogicException(
        'No se encontró el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    const categoriaProducto: CategoriaProductoEntity =
      await this.categoriaProductoRepository.findOne({
        where: { id: `${producto.categoriaProducto.id}` },
      });
    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'No se encontró la categoría de producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    producto.categoriaProducto = categoriaProducto;
    return await this.productoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'No se encontró el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productoRepository.remove(producto);
  }
}
