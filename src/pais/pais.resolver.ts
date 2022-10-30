import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';


@Resolver()
export class PaisResolver {
    constructor(
        private paisService: PaisService,
    ) { }

    @Query(() => [PaisEntity])
    paises(): Promise<PaisEntity[]> {
        return this.paisService.obtenerTodos();
    }

    @Query(() => PaisEntity)
    pais(@Args('id') id: string): Promise<PaisEntity> {
        return this.paisService.obtenerPorId(id);
    }

    @Mutation(() => PaisEntity)
    async crearPais(
        @Args('pais') paisDto: PaisDto,
    ): Promise<PaisEntity> {
        const pais: PaisEntity = {
            id: undefined,
            nombre: paisDto.nombre
        };
        return this.paisService.crear(pais);
    }

    @Mutation(() => PaisEntity)
    async actualizarPais(
        @Args('id') id: string,
        @Args('pais') paisDto: PaisDto,
    ): Promise<PaisEntity> {
        const pais: PaisEntity = {
            id: id,
            nombre: paisDto.nombre,
        };
        return this.paisService.actualizar(id, pais);
    }

    @Mutation(() => String)
    eliminarPais(@Args('id') id: string) {
        this.paisService.borrar(id);
        return id;
    }

}
