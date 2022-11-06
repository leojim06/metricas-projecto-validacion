import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaGastronomicaProductoService {
  cacheKey = 'productos';
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async adicionarProductoACulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encontró el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.productos = [
      ...culturaGastronomica.productos,
      producto,
    ];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async obtenerProductoPorIdCulturaGastronomicaYIdProducto(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    await this.verificarParametros(productoId, culturaGastronomicaId);
    const productoCulturagastronomica: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id: productoId },
      });
    return productoCulturagastronomica;
  }

  private async verificarParametros(
    productoId: string,
    culturaGastronomicaId: string,
  ) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encontró el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const productoCulturagastronomica: ProductoEntity =
      culturaGastronomica.productos.find((e) => e.id === producto.id);

    if (!productoCulturagastronomica)
      throw new BusinessLogicException(
        'El producto con el id suministrado no está asociado a la cultura gastronómica',
        BusinessError.PRECONDITION_FAILED,
      );
  }

  async obtenerProductosPorIdCulturaGastronomica(
    culturaGastronomicaId: string,
  ): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);
    if (!cached) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['productos'],
        });
      if (!culturaGastronomica)
        throw new BusinessLogicException(
          'No se encontró la cultura gastronómica con el id suministrado',
          BusinessError.NOT_FOUND,
        );
      await this.cacheManager.set(this.cacheKey, culturaGastronomica.productos);
      return culturaGastronomica.productos;
    }
    return cached;
  }

  async asociarProductosCulturaGastronomica(
    culturaGastronomicaId: string,
    productos: ProductoEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });

    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    for (let p of productos) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: p.id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'No se encontró el producto con el id suministrado',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.productos = productos;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async eliminarProductoCulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ) {
    await this.verificarParametros(productoId, culturaGastronomicaId);
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });

    culturaGastronomica.productos = culturaGastronomica.productos.filter(
      (e) => e.id !== productoId,
    );
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
