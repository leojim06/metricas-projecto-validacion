import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulturaGastronomicaService } from '../cultura-gastronomica/cultura-gastronomica.service';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Resolver()
export class RecetaResolver {
    constructor(
        private recetaService: RecetaService,
        private culturaGastronomicaService: CulturaGastronomicaService,
    ) { }

    @Query(() => [RecetaEntity])
    recetas(): Promise<RecetaEntity[]> {
        return this.recetaService.obtenerTodos();
    }

    @Query(() => RecetaEntity)
    receta(@Args('id') id: string): Promise<RecetaEntity> {
        return this.recetaService.obtenerPorId(id);
    }

    @Mutation(() => RecetaEntity)
    async crearReceta(
        @Args('receta') recetaDto: RecetaDto,
    ): Promise<RecetaEntity> {
        const receta: RecetaEntity = {
            id: undefined,
            nombre: recetaDto.nombre,
            descripcion: recetaDto.descripcion,
            foto: recetaDto.foto,
            instruccionesPreparacion: recetaDto.instruccionesPreparacion,
            video: recetaDto.video
        };
        return this.recetaService.crear(receta);
    }

    @Mutation(() => RecetaEntity)
    async actualizarReceta(
        @Args('id') id: string,
        @Args('receta') recetaDto: RecetaDto,
    ): Promise<RecetaEntity> {
        const receta: RecetaEntity = {
            id: undefined,
            nombre: recetaDto.nombre,
            descripcion: recetaDto.descripcion,
            foto: recetaDto.foto,
            instruccionesPreparacion: recetaDto.instruccionesPreparacion,
            video: recetaDto.video
        };

        return this.recetaService.actualizar(id, receta);
    }

    @Mutation(() => String)
    eliminarRceta(@Args('id') id: string) {
        this.recetaService.borrar(id);
        return id;
    }

}
