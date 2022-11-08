import { Test, TestingModule } from "@nestjs/testing";
import { faker } from '@faker-js/faker';
import { RestauranteResolver } from "./restaurante.resolver";
import { RestauranteEntity } from "./restaurante.entity";
import { RestauranteService } from "./restaurante.service";

describe('Restaurante resolver', () => {

    let resolver: RestauranteResolver;
    let restauranteList: RestauranteEntity[];
    let restauranteNuevo: RestauranteEntity;


    const restauranteServiceMock = {
        obtenerTodos: jest.fn((): RestauranteEntity[] => restauranteList),
        obtenerPorId: jest.fn((id: string): RestauranteEntity => restauranteList[0]),
        crear: jest.fn((cultura: RestauranteEntity) => restauranteNuevo),
        actualizar: jest.fn((id: string, cultura: RestauranteEntity) => restauranteList[0]),
        eliminar: jest.fn((id: string) => { })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RestauranteResolver, { provide: RestauranteService, useValue: restauranteServiceMock }]
        }).compile()

        resolver = module.get<RestauranteResolver>(RestauranteResolver)

        await seedDatabase();
    })

    const seedDatabase = async () => {
        restauranteList = [];
        for (let i = 0; i < 5; i++) {
            const restaurante: RestauranteEntity =
            {
                id: faker.datatype.uuid(),
                nombre:
                    faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
                ciudad: faker.lorem.sentence(),
                estrellasMichelin: faker.datatype.number(),
                anioConsecucionEstrellaMichelin: faker.datatype.number(),
            };
            restauranteList.push(restaurante);
        }

        restauranteNuevo = {
            id: faker.datatype.uuid(),
            nombre:
                faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
            ciudad: faker.lorem.sentence(),
            estrellasMichelin: faker.datatype.number(),
            anioConsecucionEstrellaMichelin: faker.datatype.number(),
        }
    };

    it('debe estar definido', () => {
        expect(resolver).toBeDefined()
    })

    it('Query debe retornar todos los restaurantes', () => {
        const result = resolver.restaurantes()
        expect(Array.isArray(result)).toEqual(true);
        expect(result).toHaveLength(restauranteList.length)
    })

    it('Query debe retornar un restaurante por id', () => {
        const result = resolver.restaurante(restauranteList[0].id)
        expect(result).toBe(restauranteList[0])
    })

    it('Mutation debe crear un restaurante', () => {
        const result = resolver.crearRestaurante(restauranteNuevo)
        expect(result).toBe(restauranteNuevo)
    })

    it('Mutation debe actualizar un restaurante', () => {
        const result = resolver.actualizarRestaurante(restauranteList[0].id, restauranteNuevo)
        expect(result).toBe(restauranteList[0])
    })

    it('Mutation debe borrar un restaurante', () => {
        const result = resolver.eliminarRestaurante(restauranteList[0].id)
        expect(result).toEqual(restauranteList[0].id)
    })
})