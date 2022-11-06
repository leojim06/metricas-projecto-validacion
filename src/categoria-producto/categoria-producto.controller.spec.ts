import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';
import { faker } from '@faker-js/faker';
import { CategoriaProductoController } from './categoria-producto.controller';

describe('CategoriaProductoService', () => {
    let controller: CategoriaProductoController;
    let service: CategoriaProductoService;
    let repository: Repository<CategoriaProductoEntity>;
    let categoriasProductoList: CategoriaProductoEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [CategoriaProductoService],
        }).compile();

        service = module.get<CategoriaProductoService>(CategoriaProductoService);
        repository = module.get<Repository<CategoriaProductoEntity>>(
            getRepositoryToken(CategoriaProductoEntity),
        );
        controller = new CategoriaProductoController(service)
        await seedDatabase();
    });

    const seedDatabase = async () => {
        repository.clear();
        categoriasProductoList = [];
        for (let i = 0; i < 5; i++) {
            const categoriaProducto: CategoriaProductoEntity = await repository.save({
                nombre: faker.commerce.productAdjective(),
            });
            categoriasProductoList.push(categoriaProducto);
        }
    };

    it('findAll debe retornar todas las categorias producto', async () => {
        jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(categoriasProductoList))
        expect(await controller.findAll()).toBe(categoriasProductoList)
    });

    it('findAll debe retornar una categorias producto por id', async () => {
        jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(categoriasProductoList[0]))
        expect(await controller.findOne(categoriasProductoList[0].id)).toBe(categoriasProductoList[0])
    });
});