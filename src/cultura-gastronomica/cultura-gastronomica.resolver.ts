import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Resolver()
export class CulturaGastronomicaResolver {

    constructor(private culturaGastronomicaService: CulturaGastronomicaService) { }

    @Query(() => [CulturaGastronomicaEntity])
    culturasGastronomicas(): Promise<CulturaGastronomicaEntity[]> {
        return this.culturaGastronomicaService.obtenerTodos();
    }

    @Query(() => CulturaGastronomicaEntity)
    culturaGastronomica(
        @Args('id') id: string): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaService.obtenerPorId(id);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    crearCulturaGastronomica(
        @Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.crear(cultura);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    actualizarCulturaGastronomica(
        @Args('id') id: string,
        @Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.actualizar(id, cultura);
    }

    @Mutation(() => String)
    borrarCulturaGastronomica(@Args('id') id: string) {
        this.culturaGastronomicaService.borrar(id);
        return id;
    }
}
