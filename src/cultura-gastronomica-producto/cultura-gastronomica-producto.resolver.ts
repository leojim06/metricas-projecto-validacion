import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaEntity } from 'src/cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';

@Resolver()
export class CulturaGastronomicaProductoResolver {
  constructor(
    private culturaGastronomicaService: CulturaGastronomicaProductoService,
  ) {}

  @Query(() => ProductoEntity)
  obtenerProductoPorIdCulturaGastronomicaYIdProducto(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('productoId') productoId: string,
  ): Promise<ProductoEntity> {
    return this.culturaGastronomicaService.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
      culturaGastronomicaId,
      productoId,
    );
  }

  @Mutation(() => CulturaGastronomicaEntity)
  async adicionarProductoACulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('productoId') productoId: string,
  ): Promise<CulturaGastronomicaEntity> {
    return this.culturaGastronomicaService.adicionarProductoACulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }

  @Query(() => [ProductoEntity])
  obtenerProductosPorIdCulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
  ): Promise<ProductoEntity[]> {
    return this.culturaGastronomicaService.obtenerProductosPorIdCulturaGastronomica(
      culturaGastronomicaId,
    );
  }

  @Mutation(() => CulturaGastronomicaEntity)
  async asociarProductosCulturaGastronomica(
    @Args({ name: 'productos', type: () => [ProductoDto] })
    productosDto: ProductoDto[],
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return this.culturaGastronomicaService.asociarProductosCulturaGastronomica(
      culturaGastronomicaId,
      productos,
    );
  }

  @Mutation(() => CulturaGastronomicaEntity)
  eliminarProductoCulturaGastronomica(
    @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    @Args('productoId') productoId: string,
  ){
    return this.culturaGastronomicaService.eliminarProductoCulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }
}
