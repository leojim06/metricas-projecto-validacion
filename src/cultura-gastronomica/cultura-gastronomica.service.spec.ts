import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';

describe('CulturaGastronomicaService', () => {
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

  it('obtenerTodos debe retornar todas las culturas gastronĂ³micas', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity[] =
      await service.obtenerTodos();
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica).toHaveLength(culturaGastronomicaList.length);
  });

  it('obtenerPorId debe retormar una cultura gastromĂ³mica por su id', async () => {
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

  it('obtenerPorId debe lanzar una excepciĂ³n para una cultura gastronĂ³mica invĂ¡lida', async () => {
    await expect(() => service.obtenerPorId('0')).rejects.toHaveProperty(
      'message',
      'No se encontrĂ³ la cultura gastronĂ³mica con el id indicado',
    );
  });

  it('crear debe retornar una nueva cultura gastronĂ³mica', async () => {
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

  it('actualizar debe modificar la cultura gastronĂ³mica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    culturaGastronomica.nombre = 'Cultura GastronĂ³mica';
    culturaGastronomica.descripcion = 'Cultura GastronĂ³mica Modificada';
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

  it('actualizar debe lanzar una excepciĂ³n para una cultura gastronĂ³mica invĂ¡lida', async () => {
    let culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    culturaGastronomica = {
      ...culturaGastronomica,
      nombre: 'Cultura GastronĂ³mica',
      descripcion: 'Cultura GastronĂ³mica Modificada',
    };
    await expect(() =>
      service.actualizar('0', culturaGastronomica),
    ).rejects.toHaveProperty(
      'message',
      'No se encontrĂ³ la cultura gastronĂ³mica con el id indicado',
    );
  });

  it('borrar debe quitar la cultura gastronĂ³mica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    await service.borrar(culturaGastronomica.id);
    const culturaGastronomicaEliminada: CulturaGastronomicaEntity =
      await repository.findOne({ where: { id: `${culturaGastronomica.id}` } });
    expect(culturaGastronomicaEliminada).toBeNull();
  });

  it('borrar debe lanzar una excepciĂ³n para una cultura gastronĂ³mica invĂ¡lida', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicaList[0];
    await service.borrar(culturaGastronomica.id);
    await expect(() => service.borrar('0')).rejects.toHaveProperty(
      'message',
      'No se encontrĂ³ la cultura gastronĂ³mica con el id indicado',
    );
  });
});
