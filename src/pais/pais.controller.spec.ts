import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import * as sqliteStore from 'cache-manager-sqlite';
import { PaisController } from "./pais.controller";
import { PaisService } from "./pais.service";
import { PaisEntity } from "./pais.entity";

describe('Pais controller', () => {
    let controller: PaisController;
    let service: PaisService;
    let paisList: PaisEntity[];

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
            controllers: [PaisController],
            providers: [PaisService]
        }).compile();

        controller = module.get<PaisController>(PaisController)
        service = module.get<PaisService>(PaisService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        paisList = [];
        for (let i = 0; i < 5; i++) {
            const paises: PaisEntity = {
                id: faker.datatype.uuid(),
                nombre: faker.address.country(),
            }
            paisList.push(paises);
        }
    };

    it('obtenerTodos debe retornar todas las paises', async () => {
        jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(paisList));
        expect(await controller.obtenerTodos()).toBe(paisList);
    })

    it('obtenerPorId debe retornar un pais por id', async () => {
        jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(paisList[0]))
        expect(await controller.obtenerPais(paisList[0].id)).toBe(paisList[0])
    })

    it('crear debe crear un pais', async () => {
        jest.spyOn(service, 'crear').mockImplementation(() => Promise.resolve(paisList[0]))
        expect(await controller.crear(paisList[0])).toBe(paisList[0])
    })

    it('actualizar debe actualizar un pais', async () => {
        jest.spyOn(service, 'actualizar').mockImplementation(() => Promise.resolve(paisList[0]))
        expect(await controller.actualizar(paisList[0].id, paisList[0])).toBe(paisList[0])
    })

    it('actualizar debe actualizar un pais', async () => {
        jest.spyOn(service, 'borrar').mockImplementation(() => Promise.resolve())
        expect(await controller.elminar(paisList[0].id)).toBe(undefined)
    })
})