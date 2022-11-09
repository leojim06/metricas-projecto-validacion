import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import * as sqliteStore from 'cache-manager-sqlite';
import { CategoriaProductoController } from "./categoria-producto.controller";
import { CategoriaProductoService } from "./categoria-producto.service";
import { CategoriaProductoEntity } from "./categoria-producto.entity";

describe('Cultura gastronomica controller', () => {
    let controller: CategoriaProductoController;
    let service: CategoriaProductoService;
    let categoriasProductoList: CategoriaProductoEntity[];

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
            controllers: [CategoriaProductoController],
            providers: [CategoriaProductoService]
        }).compile();

        controller = module.get<CategoriaProductoController>(CategoriaProductoController)
        service = module.get<CategoriaProductoService>(CategoriaProductoService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        categoriasProductoList = [];
        for (let i = 0; i < 5; i++) {
            const categoriaProducto: CategoriaProductoEntity = {
                id: faker.datatype.uuid(),
                nombre: faker.commerce.productAdjective(),
            }
            categoriasProductoList.push(categoriaProducto);
        }
    };

    it('obtenerTodos debe retornar todas las categorias producto', async () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(categoriasProductoList));
        expect(await controller.findAll()).toBe(categoriasProductoList);
    })

    it('obtenerPorId debe retornar una categorias producto por id', async () => {
        jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(categoriasProductoList[0]))
        expect(await controller.findOne(categoriasProductoList[0].id)).toBe(categoriasProductoList[0])
    })

    it('crear debe crear una categorias producto', async () => {
        jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(categoriasProductoList[0]))
        expect(await controller.create(categoriasProductoList[0])).toBe(categoriasProductoList[0])
    })

    it('actualizar debe actualizar una categorias producto', async () => {
        jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(categoriasProductoList[0]))
        expect(await controller.update(categoriasProductoList[0].id, categoriasProductoList[0])).toBe(categoriasProductoList[0])
    })

    it('actualizar debe actualizar una categorias producto', async () => {
        jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve())
        expect(await controller.delete(categoriasProductoList[0].id)).toBe(undefined)
    })
})