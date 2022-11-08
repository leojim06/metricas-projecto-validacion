import { Test, TestingModule } from "@nestjs/testing";
import { faker } from '@faker-js/faker';
import { RecetaResolver } from "./receta.resolver";
import { RecetaEntity } from "./receta.entity";
import { RecetaService } from "./receta.service";
import { CulturaGastronomicaService } from "../cultura-gastronomica/cultura-gastronomica.service";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { CacheModule } from "@nestjs/common";
import * as sqliteStore from 'cache-manager-sqlite';

describe('Receta resolver', () => {

    let resolver: RecetaResolver;
    let recetaList: RecetaEntity[];
    let recetaNueva: RecetaEntity;


    const recetaServiceMock = {
        obtenerTodos: jest.fn((): RecetaEntity[] => recetaList),
        obtenerPorId: jest.fn((id: string): RecetaEntity => recetaList[0]),
        crear: jest.fn((cultura: RecetaEntity) => recetaNueva),
        actualizar: jest.fn((id: string, cultura: RecetaEntity) => recetaList[0]),
        borrar: jest.fn((id: string) => { })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ...TypeOrmTestingConfig(),
                CacheModule.register({
                    store: sqliteStore,
                    path: ':memory:',
                    options: {
                        ttl: 5
                    },
                }),
            ],
            providers: [RecetaResolver, CulturaGastronomicaService, { provide: RecetaService, useValue: recetaServiceMock }]
        }).compile()

        resolver = module.get<RecetaResolver>(RecetaResolver)

        await seedDatabase();
    })

    const seedDatabase = async () => {
        recetaList = [];
        for (let i = 0; i < 5; i++) {
            const receta: RecetaEntity =
            {
                id: faker.datatype.uuid(),
                nombre:
                    faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
                descripcion: faker.lorem.sentence(),
                instruccionesPreparacion: faker.lorem.sentence(),
                foto: faker.image.food(),
                video: faker.image.food(),
            };
            recetaList.push(receta);
        }

        recetaNueva = {
            id: faker.datatype.uuid(),
            nombre:
                faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
            descripcion: faker.lorem.sentence(),
            instruccionesPreparacion: faker.lorem.sentence(),
            foto: faker.image.food(),
            video: faker.image.food(),
        }
    };

    it('debe estar definido', () => {
        expect(resolver).toBeDefined()
    })

    it('Query debe retornar todas las recetas', () => {
        const result = resolver.recetas()
        expect(Array.isArray(result)).toEqual(true);
        expect(result).toHaveLength(recetaList.length)
    })

    it('Query debe retornar una receta por id', () => {
        const result = resolver.receta(recetaList[0].id)
        expect(result).toBe(recetaList[0])
    })

    // it('Mutation debe crear una receta', () => {
    //     const result = resolver.crearReceta(recetaNueva)
    //     expect(result).toBe(recetaNueva)
    // })

    // it('Mutation debe actualizar una receta', () => {
    //     const result = resolver.actualizarReceta(recetaList[0].id, recetaNueva)
    //     expect(result).toBe(recetaList[0])
    // })

    it('Mutation debe borrar una receta', () => {
        const result = resolver.eliminarRceta(recetaList[0].id)
        expect(result).toEqual(recetaList[0].id)
    })
})