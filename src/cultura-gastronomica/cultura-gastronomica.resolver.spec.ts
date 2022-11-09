import { Test, TestingModule } from "@nestjs/testing";
import { CulturaGastronomicaEntity } from "./cultura-gastronomica.entity";
import { CulturaGastronomicaResolver } from "./cultura-gastronomica.resolver";
import { CulturaGastronomicaService } from "./cultura-gastronomica.service";
import { faker } from '@faker-js/faker';


describe('Cultura gastronomica resolver', () => {

    let resolver: CulturaGastronomicaResolver;
    let culturaGastronomicaList: CulturaGastronomicaEntity[];
    let culturaGastronomicaNueva: CulturaGastronomicaEntity;


    const culturaGastronomicaServiceMock = {
        obtenerTodos: jest.fn((): CulturaGastronomicaEntity[] => culturaGastronomicaList),
        obtenerPorId: jest.fn((id: string): CulturaGastronomicaEntity => culturaGastronomicaList[0]),
        crear: jest.fn((cultura: CulturaGastronomicaEntity) => culturaGastronomicaNueva),
        actualizar: jest.fn((id: string, cultura: CulturaGastronomicaEntity) => culturaGastronomicaList[0]),
        borrar: jest.fn((id: string) => { })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CulturaGastronomicaResolver, { provide: CulturaGastronomicaService, useValue: culturaGastronomicaServiceMock }]
        }).compile()

        resolver = module.get<CulturaGastronomicaResolver>(CulturaGastronomicaResolver)

        await seedDatabase();
    })

    const seedDatabase = async () => {
        culturaGastronomicaList = [];
        for (let i = 0; i < 5; i++) {
            const culturaGastronomica: CulturaGastronomicaEntity =
            {
                id: faker.datatype.uuid(),
                nombre: faker.company.name(),
                descripcion: faker.lorem.sentence(),
                paises: [],
                recetas: []
            };
            culturaGastronomicaList.push(culturaGastronomica);
        }

        culturaGastronomicaNueva = {
            id: faker.datatype.uuid(),
            nombre: faker.company.name(),
            descripcion: faker.lorem.sentence(),
            paises: [],
            recetas: []
        }
    };

    it('debe estar definido', () => {
        expect(resolver).toBeDefined()
    })

    it('Query debe retornar todas las culturas gastronomicas', () => {
        const result = resolver.culturasGastronomicas()
        expect(Array.isArray(result)).toEqual(true);
        expect(result).toHaveLength(culturaGastronomicaList.length)
    })

    it('Query debe retornar una cultura gastronomica por id', () => {
        const result = resolver.culturaGastronomica(culturaGastronomicaList[0].id)
        expect(result).toBe(culturaGastronomicaList[0])
    })

    it('Mutation debe crear una cultura gastronomica', () => {
        const result = resolver.crearCulturaGastronomica(culturaGastronomicaNueva)
        expect(result).toBe(culturaGastronomicaNueva)
    })

    it('Mutation debe actualizar una cultura gastronomica', () => {
        const result = resolver.actualizarCulturaGastronomica(culturaGastronomicaList[0].id, culturaGastronomicaNueva)
        expect(result).toBe(culturaGastronomicaList[0])
    })

    it('Mutation debe borrar una cultura gastronomica', () => {
        const result = resolver.borrarCulturaGastronomica(culturaGastronomicaList[0].id)
        expect(result).toEqual(culturaGastronomicaList[0].id)
    })
})