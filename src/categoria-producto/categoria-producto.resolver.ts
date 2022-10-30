import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CategoriaProductoDto } from './categoria-producto.dto';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';

@Resolver()
export class CategoriaProductoResolver {
  constructor(private categoriaProductoService: CategoriaProductoService) {}

  @Query(() => [CategoriaProductoEntity])
  categoriasProducto(): Promise<CategoriaProductoEntity[]> {
    return this.categoriaProductoService.findAll();
  }

  @Query(() => CategoriaProductoEntity)
  categoriaProducto(@Args('id') id: string): Promise<CategoriaProductoEntity> {
    return this.categoriaProductoService.findOne(id);
  }

  @Mutation(() => CategoriaProductoEntity)
  crearCategoriaProducto(
    @Args('categoriaProducto') categoriaProductoDto: CategoriaProductoDto,
  ): Promise<CategoriaProductoEntity> {
    const categoriaProducto = plainToInstance(
      CategoriaProductoEntity,
      categoriaProductoDto,
    );
    return this.categoriaProductoService.create(categoriaProducto);
  }

  @Mutation(() => CategoriaProductoEntity)
  actualizarCategoriaProducto(
    @Args('id') id: string,
    @Args('categoriaProducto') categoriaProductoDto: CategoriaProductoDto,
  ): Promise<CategoriaProductoEntity> {
    const categoriaProducto = plainToInstance(
      CategoriaProductoEntity,
      categoriaProductoDto,
    );
    return this.categoriaProductoService.update(id, categoriaProducto);
  }

  @Mutation(() => String)
  eliminarCategoriaProducto(@Args('id') id: string) {
    this.categoriaProductoService.delete(id);
    return id;
  }
}
