import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller';

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturaGastronomicaList: CulturaGastronomicaEntity[];
  let controller: CulturaGastronomicaController;

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
    controller = new CulturaGastronomicaController(service);
    await seedDatabase();
  });

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

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('obtenerTodos debe retornar todas las culturas gastronómicas', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity[] =
      await service.obtenerTodos();
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica).toHaveLength(culturaGastronomicaList.length);
  });

  it('obtenerPorId debe retormar una cultura gastromómica por su id', async () => {
    const culturaGastronomicaGuardada: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    const culturaGastronomica: CulturaGastronomicaEntity =
      await service.obtenerPorId(culturaGastronomicaGuardada.id);
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica.nombre).toEqual(
      culturaGastronomicaGuardada.nombre,
    );
    expect(culturaGastronomica.descripcion).toEqual(
      culturaGastronomicaGuardada.descripcion,
    );
  });

  it('obtenerPorId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() => service.obtenerPorId('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('crear debe retornar una nueva cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      paises: [],
    };

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await service.crear(culturaGastronomica);
    expect(nuevaCulturaGastronomica).not.toBeNull();

    const culturaGastronomicaGuardada: CulturaGastronomicaEntity =
      await repository.findOne({
        where: { id: `${nuevaCulturaGastronomica.id}` },
      });
    expect(culturaGastronomicaGuardada).not.toBeNull();
    expect(culturaGastronomicaGuardada.nombre).toEqual(
      nuevaCulturaGastronomica.nombre,
    );
    expect(culturaGastronomicaGuardada.descripcion).toEqual(
      nuevaCulturaGastronomica.descripcion,
    );
  });

  it('actualizar debe modificar la cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    culturaGastronomica.nombre = 'Cultura Gastronómica';
    culturaGastronomica.descripcion = 'Cultura Gastronómica Modificada';
    const culturaGastronomicaActualizada: CulturaGastronomicaEntity =
      await service.actualizar(culturaGastronomica.id, culturaGastronomica);

    expect(culturaGastronomicaActualizada).not.toBeNull();
    const culturaGastronomicaGuardada: CulturaGastronomicaEntity =
      await repository.findOne({ where: { id: `${culturaGastronomica.id}` } });
    expect(culturaGastronomicaGuardada).not.toBeNull();
    expect(culturaGastronomicaGuardada.nombre).toEqual(
      culturaGastronomicaActualizada.nombre,
    );
    expect(culturaGastronomicaGuardada.descripcion).toEqual(
      culturaGastronomicaActualizada.descripcion,
    );
  });

  it('actualizar debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    let culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    culturaGastronomica = {
      ...culturaGastronomica,
      nombre: 'Cultura Gastronómica',
      descripcion: 'Cultura Gastronómica Modificada',
    };
    await expect(() =>
      service.actualizar('0', culturaGastronomica),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('borrar debe quitar la cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    await service.borrar(culturaGastronomica.id);
    const culturaGastronomicaEliminada: CulturaGastronomicaEntity =
      await repository.findOne({ where: { id: `${culturaGastronomica.id}` } });
    expect(culturaGastronomicaEliminada).toBeNull();
  });

  it('borrar debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    await service.borrar(culturaGastronomica.id);
    await expect(() => service.borrar('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('obtenerTodos debe retornar todas las culturas gastronómicas', async () => {
    jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(culturaGastronomicaList));
    expect(await controller.obtenerTodos()).toBe(culturaGastronomicaList);
  })

  it('obtenerPorId debe retornar una cultura gastronomica por id', async () => {
    jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(culturaGastronomicaList[0]))
    expect(await controller.findOne(culturaGastronomicaList[0].id)).toBe(culturaGastronomicaList[0])
  })
});
