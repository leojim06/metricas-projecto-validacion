import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import * as sqliteStore from 'cache-manager-sqlite';
import { RecetaController } from "./receta.controller";
import { RecetaService } from "./receta.service";
import { RecetaEntity } from "./receta.entity";

describe('Receta controller', () => {
    let controller: RecetaController;
    let service: RecetaService;
    let recetaList: RecetaEntity[];

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
            controllers: [RecetaController],
            providers: [RecetaService]
        }).compile();

        controller = module.get<RecetaController>(RecetaController)
        service = module.get<RecetaService>(RecetaService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        recetaList = [];
        for (let i = 0; i < 5; i++) {
            const receta: RecetaEntity = {
                id: faker.datatype.uuid(),
                nombre:
                    faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
                descripcion: faker.lorem.sentence(),
                instruccionesPreparacion: faker.lorem.sentence(),
                foto: faker.image.food(),
                video: faker.image.food(),
            }
            recetaList.push(receta);
        }
    };

    it('obtenerTodos debe retornar todas las recetas', async () => {
        jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(recetaList));
        expect(await controller.obtenerTodos()).toBe(recetaList);
    })

    it('obtenerPorId debe retornar una receta por id', async () => {
        jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(recetaList[0]))
        expect(await controller.obtenerReceta(recetaList[0].id)).toBe(recetaList[0])
    })

    it('crear debe crear una receta', async () => {
        jest.spyOn(service, 'crear').mockImplementation(() => Promise.resolve(recetaList[0]))
        expect(await controller.create(recetaList[0])).toBe(recetaList[0])
    })

    it('actualizar debe actualizar una receta', async () => {
        jest.spyOn(service, 'actualizar').mockImplementation(() => Promise.resolve(recetaList[0]))
        expect(await controller.actualizar(recetaList[0].id, recetaList[0])).toBe(recetaList[0])
    })

    it('actualizar debe actualizar una receta', async () => {
        jest.spyOn(service, 'borrar').mockImplementation(() => Promise.resolve())
        expect(await controller.eliminar(recetaList[0].id)).toBe(undefined)
    })
})