import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { RestauranteController } from './restaurante.controller';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restauranteLista: RestauranteEntity[];
  let controller: RestauranteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),
      CacheModule.register({
        store: sqliteStore,
        path: ':memory:',
        options: {
          ttl: 5
        },
      }),],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    controller = new RestauranteController(service);
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restauranteLista = [];
    for (let i = 0; i < 5; ++i) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre:
          faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
        ciudad: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        anioConsecucionEstrellaMichelin: faker.datatype.number(),
      });
      restauranteLista.push(restaurante);
    }
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('obtenerTodos debe retornar todas las restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.obtenerTodos();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restauranteLista.length);
  });

  it('obtenerPorId debe retormar una restaurante por su id', async () => {
    const restauranteAletoria: RestauranteEntity = restauranteLista[0];
    const restauranteObtenida: RestauranteEntity = await service.obtenerPorId(
      restauranteAletoria.id,
    );
    expect(restauranteObtenida).not.toBeNull();
    expect(restauranteObtenida.nombre).toEqual(restauranteAletoria.nombre);
  });

  it('obtenerPorId debe lanzar una excepción para una restaurante inválida', async () => {
    await expect(() => service.obtenerPorId('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el restaurante con el id indicado',
    );
  });


  it('crear debe retornar una nueva restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      nombre: faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
      ciudad: faker.lorem.sentence(),
      estrellasMichelin: faker.datatype.number(),
      anioConsecucionEstrellaMichelin: faker.datatype.number(),
    };

    const restauranteNueva: RestauranteEntity = await service.crear(
      restaurante,
    );
    expect(restauranteNueva).not.toBeNull();

    const restauranteObtenida: RestauranteEntity = await repository.findOne({
      where: { id: `${restauranteNueva.id}` },
    });
    expect(restauranteObtenida).not.toBeNull();
    expect(restauranteObtenida.nombre).toEqual(restauranteNueva.nombre);
  });

  it('actualizar debe modificar una restaurante', async () => {
    const restauranteAletoria: RestauranteEntity = restauranteLista[0];
    (restauranteAletoria.nombre =
      faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ');
    restauranteAletoria.estrellasMichelin = faker.datatype.number();
    restauranteAletoria.anioConsecucionEstrellaMichelin =
      faker.datatype.number();

    const restauranteActualizada: RestauranteEntity = await service.actualizar(
      restauranteAletoria.id,
      restauranteAletoria,
    );

    expect(restauranteActualizada).not.toBeNull();
    const restauranteGuardada: RestauranteEntity = await repository.findOne({
      where: { id: `${restauranteActualizada.id}` },
    });
    expect(restauranteGuardada).not.toBeNull();
    expect(restauranteGuardada.nombre).toEqual(restauranteActualizada.nombre);
  });

  it('actualizar debe lanzar una excepción para un restaurante inválido', async () => {
    let restaurante: RestauranteEntity = restauranteLista[0];
    restaurante = {
      ...restaurante,
      nombre: faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
    };
    await expect(() =>
      service.actualizar('0', restaurante),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el restaurante con el id indicado',
    );
  });

  it('borrar debe quitar la restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteLista[0];
    await service.eliminar(restaurante.id);
    const restauranteEliminada: RestauranteEntity = await repository.findOne({
      where: { id: `${restaurante.id}` },
    });
    expect(restauranteEliminada).toBeNull();
  });

  it('borrar debe lanzar una excepción para un restaurante inválido', async () => {
    const restaurante: RestauranteEntity = restauranteLista[0];
    await service.eliminar(restaurante.id);
    await expect(() => service.eliminar('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la restaurante con el id indicado',
    );
  });

  it('obtenerTodos debe retornar todas los restaurantes', async () => {
    jest.spyOn(service, 'obtenerTodos').mockImplementation(() => Promise.resolve(restauranteLista));
    expect(await controller.obtenerTodos()).toBe(restauranteLista);
  })

  it('obtenerPorId debe retornar un restaurante por id', async () => {
    jest.spyOn(service, 'obtenerPorId').mockImplementation(() => Promise.resolve(restauranteLista[0]))
    expect(await controller.obtenerRestaurante(restauranteLista[0].id)).toBe(restauranteLista[0])
  })
});
