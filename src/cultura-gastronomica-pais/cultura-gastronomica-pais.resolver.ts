import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaisEntity } from 'src/pais/pais.entity';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisDto } from 'src/pais/pais.dto';
import { plainToInstance } from 'class-transformer';


@Resolver()
export class CulturaGastronomicaPaisResolver {
    constructor(
        private culturaGastronomicaPaisService: CulturaGastronomicaPaisService,
    ) { }


    @Query(() => PaisEntity)
    obtenerPaisPorIdCulturaGastronomicaYIdPais(
        @Args('culturaGastronomicaId') culturaGastronomicaId: string,
        @Args('paisId') paisId: string,
    ): Promise<PaisEntity> {
        return this.culturaGastronomicaPaisService.buscarPaisPorCulturaGastronomicaIdPaisId(
            culturaGastronomicaId,
            paisId,
        );
    }

    @Mutation(() => CulturaGastronomicaEntity)
    async adicionarPaisACulturaGastronomica(
        @Args('culturaGastronomicaId') culturaGastronomicaId: string,
        @Args('paisId') paisId: string,
    ): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaPaisService.agregarPaisCulturaGastronomica(
            culturaGastronomicaId,
            paisId,
        );
    }

    @Query(() => [PaisEntity])
    obtenerPaisesPorIdCulturaGastronomica(
        @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    ): Promise<PaisEntity[]> {
        return this.culturaGastronomicaPaisService.buscarPaisesPorCulturaGastronomicaId(
            culturaGastronomicaId,
        );
    }

    @Mutation(() => CulturaGastronomicaEntity)
    async asociarPaisCulturaGastronomica(
        @Args({ name: 'paises', type: () => [PaisDto] })
        paisesDto: PaisEntity[],
        @Args('culturaGastronomicaId') culturaGastronomicaId: string,
    ): Promise<CulturaGastronomicaEntity> {
        const paises = plainToInstance(PaisDto, paisesDto);
        return this.culturaGastronomicaPaisService.asociarPaisesCulturaGastronomica(
            culturaGastronomicaId,
            paisesDto,
        );
    }

    @Mutation(() => CulturaGastronomicaEntity)
    eliminarPaisCulturaGastronomica(
        @Args('culturaGastronomicaId') culturaGastronomicaId: string,
        @Args('paisId') paisId: string,
    ){
        return this.culturaGastronomicaPaisService.borrarPaisCulturaGastronomica(
            culturaGastronomicaId,
            paisId,
        );
    }
}
