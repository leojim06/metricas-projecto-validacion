import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriaProductoService } from '../categoria-producto/categoria-producto.service';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Resolver()
export class ProductoResolver {
  constructor(
    private productoService: ProductoService,
    private categoriaProductoService: CategoriaProductoService,
  ) {}

  @Query(() => [ProductoEntity])
  productos(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }

  @Query(() => ProductoEntity)
  producto(@Args('id') id: string): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }

  @Mutation(() => ProductoEntity)
  async crearProducto(
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const categoriaProducto = await this.categoriaProductoService.findOne(
      productoDto.idCategoria,
    );
    const producto: ProductoEntity = {
      id: undefined,
      nombre: productoDto.nombre,
      descripcion: productoDto.descripcion,
      historia: productoDto.historia,
      categoriaProducto: categoriaProducto,
    };
    return this.productoService.create(producto);
  }

  @Mutation(() => ProductoEntity)
  async actualizarProducto(
    @Args('id') id: string,
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const categoriaProducto = await this.categoriaProductoService.findOne(
      productoDto.idCategoria,
    );
    const producto: ProductoEntity = {
      id: id,
      nombre: productoDto.nombre,
      descripcion: productoDto.descripcion,
      historia: productoDto.historia,
      categoriaProducto: categoriaProducto,
    };
    return this.productoService.update(id, producto);
  }

  @Mutation(() => String)
  eliminarProducto(@Args('id') id: string) {
    this.productoService.delete(id);
    return id;
  }
}
