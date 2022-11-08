import { Test, TestingModule } from "@nestjs/testing";
import { faker } from '@faker-js/faker';
import { PaisResolver } from "./pais.resolver";
import { PaisEntity } from "./pais.entity";
import { PaisService } from "./pais.service";


describe('Pais resolver', () => {

    let resolver: PaisResolver;
    let paisList: PaisEntity[];
    let paisNueva: PaisEntity;


    const paisServiceMock = {
        obtenerTodos: jest.fn((): PaisEntity[] => paisList),
        obtenerPorId: jest.fn((id: string): PaisEntity => paisList[0]),
        crear: jest.fn((cultura: PaisEntity) => paisNueva),
        actualizar: jest.fn((id: string, cultura: PaisEntity) => paisList[0]),
        borrar: jest.fn((id: string) => { })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PaisResolver, { provide: PaisService, useValue: paisServiceMock }]
        }).compile()

        resolver = module.get<PaisResolver>(PaisResolver)

        await seedDatabase();
    })

    const seedDatabase = async () => {
        paisList = [];
        for (let i = 0; i < 5; i++) {
            const pais: PaisEntity =
            {
                id: faker.datatype.uuid(),
                nombre: faker.address.country(),
            };
            paisList.push(pais);
        }

        paisNueva = {
            id: faker.datatype.uuid(),
            nombre: faker.address.country(),
        }
    };

    it('debe estar definido', () => {
        expect(resolver).toBeDefined()
    })

    it('Query debe retornar todas las paises', () => {
        const result = resolver.paises()
        expect(Array.isArray(result)).toEqual(true);
        expect(result).toHaveLength(paisList.length)
    })

    it('Query debe retornar un pais por id', () => {
        const result = resolver.pais(paisList[0].id)
        expect(result).toBe(paisList[0])
    })

    it('Mutation debe crear un pais', () => {
        const result = resolver.crearPais(paisNueva)
        expect(result).toBe(paisNueva)
    })

    it('Mutation debe actualizar un pais', () => {
        const result = resolver.actualizarPais(paisList[0].id, paisNueva)
        expect(result).toBe(paisList[0])
    })

    it('Mutation debe borrar un pais', () => {
        const result = resolver.eliminarPais(paisList[0].id)
        expect(result).toEqual(paisList[0].id)
    })
})