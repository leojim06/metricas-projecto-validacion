import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import * as sqliteStore from 'cache-manager-sqlite';
import { RestauranteController } from "./restaurante.controller";
import { RestauranteService } from "./restaurante.service";
import { RestauranteEntity } from "./restaurante.entity";

describe('Pais controller', () => {
    let controller: RestauranteController;
    let service: RestauranteService;
    let restauranteList: RestauranteEntity[];

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
            controllers: [RestauranteController],
            providers: [RestauranteService]
        }).compile();

        controller = module.get<RestauranteController>(RestauranteController)
        service = module.get<RestauranteService>(RestauranteService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        restauranteList = [];
        for (let i = 0; i < 5; i++) {
            const restaurante: RestauranteEntity = {
                id: faker.datatype.uuid(),
                nombre:
                    faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
                ciudad: faker.lorem.sentence(),
                estrellasMichelin: faker.datatype.number(),
                anioConsecucionEstrellaMichelin: faker.datatype.number(),
            }
            restauranteList.push(restaurante);
        }
    };

    it('obtenerTodos debe retornar todas los restaurantes', async () => {
        jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(restauranteList));
        expect(await controller.obtenerTodos()).toBe(restauranteList);
    })

    it('obtenerPorId debe retornar un restaurante por id', async () => {
        jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(restauranteList[0]))
        expect(await controller.obtenerRestaurante(restauranteList[0].id)).toBe(restauranteList[0])
    })

    it('crear debe crear un restaurante', async () => {
        jest.spyOn(service, 'crear').mockImplementation(() => Promise.resolve(restauranteList[0]))
        expect(await controller.crear(restauranteList[0])).toBe(restauranteList[0])
    })

    it('actualizar debe actualizar un restaurante', async () => {
        jest.spyOn(service, 'actualizar').mockImplementation(() => Promise.resolve(restauranteList[0]))
        expect(await controller.actualizar(restauranteList[0].id, restauranteList[0])).toBe(restauranteList[0])
    })

    it('actualizar debe actualizar un restaurante', async () => {
        jest.spyOn(service, 'eliminar').mockImplementation(() => Promise.resolve())
        expect(await controller.elminar(restauranteList[0].id)).toBe(undefined)
    })
})