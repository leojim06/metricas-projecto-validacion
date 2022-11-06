import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller'
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import * as sqliteStore from 'cache-manager-sqlite';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('CulturaGastronomicaController', () => {
    let culturaGastronomicaController: CulturaGastronomicaController;
    let service: CulturaGastronomicaService;
    let repository: Repository<CulturaGastronomicaEntity>;
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
            providers: [CulturaGastronomicaService],
        }).compile();
        service = module.get<CulturaGastronomicaService>(
            CulturaGastronomicaService,
        );
        repository = module.get<Repository<CulturaGastronomicaEntity>>(
            getRepositoryToken(CulturaGastronomicaEntity),
        );

        culturaGastronomicaController = new CulturaGastronomicaController(service);

        await seedDatabase();
    })

    const seedDatabase = async () => {
        repository.clear();
        culturaGastronomicaList = [];
        for (let i = 0; i < 5; i++) {
            const culturaGastronomica: CulturaGastronomicaEntity =
                await repository.save({
                    nombre: faker.company.name(),
                    descripcion: faker.lorem.sentence(),
                });
            culturaGastronomicaList.push(culturaGastronomica);
        }
    };

    it('obtenerTodos debe retornar todas las culturas gastronómicas', async () => {
        jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(culturaGastronomicaList));
        expect(await culturaGastronomicaController.obtenerTodos()).toBe(culturaGastronomicaList);
    })

    it('obtenerPorId debe retornar una cultura gastronomica por id', async () => {
        jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(culturaGastronomicaList[0]))
        expect(await culturaGastronomicaController.findOne(culturaGastronomicaList[0].id)).toBe(culturaGastronomicaList[0])
    })
})