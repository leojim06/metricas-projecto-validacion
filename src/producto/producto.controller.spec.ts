import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import * as sqliteStore from 'cache-manager-sqlite';
import { ProductoController } from "./producto.controller";
import { ProductoService } from "./producto.service";
import { ProductoEntity } from "./producto.entity";
import { CategoriaProductoService } from "../categoria-producto/categoria-producto.service";

describe('Producto controller', () => {
    let controller: ProductoController;
    let service: ProductoService;
    let productoList: ProductoEntity[];

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
            controllers: [ProductoController],
            providers: [ProductoService, CategoriaProductoService]
        }).compile();

        controller = module.get<ProductoController>(ProductoController)
        service = module.get<ProductoService>(ProductoService)

        await seedDatabase();

    })

    const seedDatabase = async () => {
        productoList = [];
        for (let i = 0; i < 5; i++) {
            const producto: ProductoEntity = {
                id: faker.datatype.uuid(),
                nombre: faker.commerce.productName(),
                descripcion: faker.commerce.productDescription(),
                historia: faker.lorem.sentence(),
                categoriaProducto: {
                    id: faker.datatype.uuid(),
                    nombre: faker.commerce.productAdjective(),
                },
            }
            productoList.push(producto);
        }


    };

    it('obtenerTodos debe retornar todos los productos', async () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(productoList));
        expect(await controller.findAll()).toBe(productoList);
    })

    it('obtenerPorId debe retornar un producto por id', async () => {
        jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(productoList[0]))
        expect(await controller.findOne(productoList[0].id)).toBe(productoList[0])
    })

    // it('crear debe crear un producto', async () => {
    //     jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(productoList[0]))
    //     expect(await controller.create(productoNuevo)).toBe(productoList[0])
    // })

    // it('actualizar debe actualizar un producto', async () => {
    //     jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(productoList[0]))
    //     expect(await controller.update(productoList[0].id, productoList[0])).toBe(productoList[0])
    // })

    it('actualizar debe actualizar un producto', async () => {
        jest.spyOn(service, 'delete').mockImplementation(() => Promise.resolve())
        expect(await controller.delete(productoList[0].id)).toBe(undefined)
    })
})