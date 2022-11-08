import { Test, TestingModule } from "@nestjs/testing";
import { faker } from '@faker-js/faker';
import { CategoriaProductoResolver } from "./categoria-producto.resolver";
import { CategoriaProductoEntity } from "./categoria-producto.entity";
import { CategoriaProductoService } from "./categoria-producto.service";


describe('Categoria producto resolver', () => {

    let resolver: CategoriaProductoResolver;
    let categoriaProductoList: CategoriaProductoEntity[];
    let categoriaProductoNueva: CategoriaProductoEntity;


    const CategoriaProductoServiceMock = {
        findAll: jest.fn((): CategoriaProductoEntity[] => categoriaProductoList),
        findOne: jest.fn((id: string): CategoriaProductoEntity => categoriaProductoList[0]),
        create: jest.fn((cultura: CategoriaProductoEntity) => categoriaProductoNueva),
        update: jest.fn((id: string, cultura: CategoriaProductoEntity) => categoriaProductoList[0]),
        delete: jest.fn((id: string) => { })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoriaProductoResolver, { provide: CategoriaProductoService, useValue: CategoriaProductoServiceMock }]
        }).compile()

        resolver = module.get<CategoriaProductoResolver>(CategoriaProductoResolver)

        await seedDatabase();
    })

    const seedDatabase = async () => {
        categoriaProductoList = [];
        for (let i = 0; i < 5; i++) {
            const culturaGastronomica: CategoriaProductoEntity =
            {
                id: faker.datatype.uuid(),
                nombre: faker.commerce.productAdjective(),
            };
            categoriaProductoList.push(culturaGastronomica);
        }

        categoriaProductoNueva = {
            id: faker.datatype.uuid(),
            nombre: faker.commerce.productAdjective(),
        }
    };

    it('debe estar definido', () => {
        expect(resolver).toBeDefined()
    })

    it('Query debe retornar todas las Categoria producto', () => {
        const result = resolver.categoriasProducto()
        expect(Array.isArray(result)).toEqual(true);
        expect(result).toHaveLength(categoriaProductoList.length)
    })

    it('Query debe retornar una Categoria producto por id', () => {
        const result = resolver.categoriaProducto(categoriaProductoList[0].id)
        expect(result).toBe(categoriaProductoList[0])
    })

    it('Mutation debe crear una Categoria producto', () => {
        const result = resolver.crearCategoriaProducto(categoriaProductoNueva)
        expect(result).toBe(categoriaProductoNueva)
    })

    it('Mutation debe actualizar una Categoria producto', () => {
        const result = resolver.actualizarCategoriaProducto(categoriaProductoList[0].id, categoriaProductoNueva)
        expect(result).toBe(categoriaProductoList[0])
    })

    it('Mutation debe borrar una Categoria producto', () => {
        const result = resolver.eliminarCategoriaProducto(categoriaProductoList[0].id)
        expect(result).toEqual(categoriaProductoList[0].id)
    })
})