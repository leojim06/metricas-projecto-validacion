import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { PaisController } from './pais.controller';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisLista: PaisEntity[];
  let controller: PaisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),
      CacheModule.register({
        store: sqliteStore,
        path: ':memory:',
        options: {
          ttl: 5,
        },
      }),
      ],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    controller = new PaisController(service)
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisLista = [];
    for (let i = 0; i < 5; ++i) {
      const pais: PaisEntity = await repository.save({
        nombre: faker.address.country(),
      });
      paisLista.push(pais);
    }
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('obtenerTodos debe retornar todas los paises', async () => {
    const paises: PaisEntity[] = await service.obtenerTodos();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisLista.length);
  });

  it('obtenerPorId debe retormar un país por su id', async () => {
    const paisAletorio: PaisEntity = paisLista[0];
    const paisObtenido: PaisEntity = await service.obtenerPorId(
      paisAletorio.id,
    );
    expect(paisObtenido).not.toBeNull();
    expect(paisObtenido.nombre).toEqual(paisAletorio.nombre);
  });

  it('obtenerPorId debe lanzar una excepción para un país inválido', async () => {
    await expect(() => service.obtenerPorId('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('crear debe retornar un nuevo país', async () => {
    const pais: PaisEntity = {
      id: '',
      nombre: faker.address.country(),
    };
    const paisNuevo: PaisEntity = await service.crear(pais);
    expect(paisNuevo).not.toBeNull();

    const paisObtenido: PaisEntity = await repository.findOne({
      where: { id: `${paisNuevo.id}` },
    });
    expect(paisObtenido).not.toBeNull();
    expect(paisObtenido.nombre).toEqual(paisNuevo.nombre);
  });

  it('actualizar debe modificar un país', async () => {
    const paisAletorio: PaisEntity = paisLista[0];
    paisAletorio.nombre = faker.address.country();
    const paisActualizado: PaisEntity = await service.actualizar(
      paisAletorio.id,
      paisAletorio,
    );

    expect(paisActualizado).not.toBeNull();
    const paisGuardado: PaisEntity = await repository.findOne({
      where: { id: `${paisActualizado.id}` },
    });
    expect(paisGuardado).not.toBeNull();
    expect(paisGuardado.nombre).toEqual(paisActualizado.nombre);
  });

  it('actualizar debe lanzar una excepción para un país inválido', async () => {
    let pais: PaisEntity = paisLista[0];
    pais = {
      ...pais,
      nombre: faker.address.country(),
    };
    await expect(() => service.actualizar('0', pais)).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('borrar debe quitar el país', async () => {
    const pais: PaisEntity = paisLista[0];
    await service.borrar(pais.id);
    const paisEliminado: PaisEntity = await repository.findOne({
      where: { id: `${pais.id}` },
    });
    expect(paisEliminado).toBeNull();
  });

  it('borrar debe lanzar una excepción para un país inválido', async () => {
    const pais: PaisEntity = paisLista[0];
    await service.borrar(pais.id);
    await expect(() => service.borrar('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('obtenerTodos debe retornar todos los paises', async () => {
    jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(paisLista));
    expect(await controller.obtenerTodos()).toBe(paisLista);
  })

  it('obtenerPorId debe retornar un pais por id', async () => {
    jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(paisLista[0]))
    expect(await controller.obtenerPais(paisLista[0].id)).toBe(paisLista[0])
  })

});
