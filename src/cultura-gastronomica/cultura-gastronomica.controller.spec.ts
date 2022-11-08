import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { CulturaGastronomicaController } from "./cultura-gastronomica.controller"
import { CulturaGastronomicaEntity } from "./cultura-gastronomica.entity";
import { CulturaGastronomicaService } from "./cultura-gastronomica.service";
import * as sqliteStore from 'cache-manager-sqlite';

describe('Cultura gastronomica controller', () => {
    let controller: CulturaGastronomicaController;
    let service: CulturaGastronomicaService;
    let culturaGastronomicaList: CulturaGastronomicaEntity[];

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
            controllers: [CulturaGastronomicaController],
            providers: [CulturaGastronomicaService]
        }).compile();

        controller = module.get<CulturaGastronomicaController>(CulturaGastronomicaController)
        service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        culturaGastronomicaList = [];
        for (let i = 0; i < 5; i++) {
            const culturaGastronomica: CulturaGastronomicaEntity = {
                id: faker.datatype.uuid(),
                nombre: faker.company.name(),
                descripcion: faker.lorem.sentence(),
                paises: [],
                recetas: []
            }
            culturaGastronomicaList.push(culturaGastronomica);
        }
    };

    it('obtenerTodos debe retornar todas las culturas gastronómicas', async () => {
        jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(culturaGastronomicaList));
        expect(await controller.obtenerTodos()).toBe(culturaGastronomicaList);
    })

    it('obtenerPorId debe retornar una cultura gastronomica por id', async () => {
        jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(culturaGastronomicaList[0]))
        expect(await controller.findOne(culturaGastronomicaList[0].id)).toBe(culturaGastronomicaList[0])
    })

    it('crear debe crear una cultura gastronomica', async () => {
        jest.spyOn(service, 'crear').mockImplementation(() => Promise.resolve(culturaGastronomicaList[0]))
        expect(await controller.create(culturaGastronomicaList[0])).toBe(culturaGastronomicaList[0])
    })

    it('actualizar debe actualizar una cultura gastronomica', async () => {
        jest.spyOn(service, 'actualizar').mockImplementation(() => Promise.resolve(culturaGastronomicaList[0]))
        expect(await controller.update(culturaGastronomicaList[0].id, culturaGastronomicaList[0])).toBe(culturaGastronomicaList[0])
    })

    it('actualizar debe actualizar una cultura gastronomica', async () => {
        jest.spyOn(service, 'borrar').mockImplementation(() => Promise.resolve())
        expect(await controller.delete(culturaGastronomicaList[0].id)).toBe(undefined)
    })
})