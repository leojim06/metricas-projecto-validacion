import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaRestauranteController } from './cultura-gastronomica-restaurante.controller';

describe('CulturaGastronomicaRestauranteService', () => {
  let service: CulturaGastronomicaRestauranteService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let nuevaRestaurante: RestauranteEntity;
  let restaurantes: RestauranteEntity[];
  let controller: CulturaGastronomicaRestauranteController

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
      providers: [CulturaGastronomicaRestauranteService],
    }).compile();

    service = module.get<CulturaGastronomicaRestauranteService>(
      CulturaGastronomicaRestauranteService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    controller = new CulturaGastronomicaRestauranteController(service)

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    restauranteRepository.clear();

    restaurantes = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        anioConsecucionEstrellaMichelin: faker.datatype.number(),
      });
      restaurantes.push(restaurante);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurantes: restaurantes,
    });

    nuevaRestaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.lorem.sentence(),
      estrellasMichelin: faker.datatype.number(),
      anioConsecucionEstrellaMichelin: faker.datatype.number(),
    });
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('agregarRestauranteCulturaGastronomica debe agregar una nueva restaurante a la cultura gastronómica', async () => {
    const nuevaRestaurante: RestauranteEntity =
      await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        anioConsecucionEstrellaMichelin: faker.datatype.number(),
      });

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    const resultado: CulturaGastronomicaEntity =
      await service.agregarRestauranteCulturaGastronomica(
        nuevaCulturaGastronomica.id,
        nuevaRestaurante.id,
      );

    expect(resultado.restaurantes.length).toBe(1);
    expect(resultado.restaurantes[0]).not.toBeNull();
    expect(resultado.restaurantes[0].nombre).toBe(nuevaRestaurante.nombre);
    expect(resultado.restaurantes[0].ciudad).toBe(nuevaRestaurante.ciudad);
    expect(resultado.restaurantes[0].estrellasMichelin).toBe(
      nuevaRestaurante.estrellasMichelin,
    );
    expect(resultado.restaurantes[0].anioConsecucionEstrellaMichelin).toBe(
      nuevaRestaurante.anioConsecucionEstrellaMichelin,
    );
  });

  it('agregarRestauranteCulturaGastronomica debe lanzar una excepción para una restaurante inválida', async () => {
    await expect(() =>
      service.agregarRestauranteCulturaGastronomica(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la restaurante con el id indicado',
    );
  });

  it('agregarRestauranteCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.agregarRestauranteCulturaGastronomica('0', nuevaRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRestaurantePorCulturaGastronomicaIdRestauranteId debe lanzar una excepción para una restaurante inválida', async () => {
    await expect(() =>
      service.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la restaurante con el id indicado',
    );
  });

  it('buscarRestaurantePorCulturaGastronomicaIdRestauranteId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
        '0',
        nuevaRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRestaurantePorCulturaGastronomicaIdRestauranteId debe lanzar una excepción para una restaurante no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
        culturaGastronomica.id,
        nuevaRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La restaurante no está relacionada a la cultura gastronómica',
    );
  });

  it('buscarRestaurantePorCulturaGastronomicaIdRestauranteId debe retornar la restaurante indicada por la cultura gastronómica indicada', async () => {
    const restauranteRelacionada: RestauranteEntity = restaurantes[0];
    const restauranteGuardada: RestauranteEntity =
      await service.buscarRestaurantePorCulturaGastronomicaIdRestauranteId(
        culturaGastronomica.id,
        restauranteRelacionada.id,
      );

    expect(restauranteGuardada).not.toBeNull();
    expect(restauranteGuardada.nombre).toBe(restauranteRelacionada.nombre);
    expect(restauranteGuardada.ciudad).toBe(restauranteRelacionada.ciudad);
    expect(restauranteGuardada.estrellasMichelin).toBe(
      restauranteRelacionada.estrellasMichelin,
    );
    expect(restauranteGuardada.anioConsecucionEstrellaMichelin).toBe(
      restauranteRelacionada.anioConsecucionEstrellaMichelin,
    );
  });

  it('buscarRestaurantesPorCulturaGastronomicaId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarRestaurantesPorCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRestaurantesPorCulturaGastronomicaId debe retornar las restaurantes relacionadas a la cultura gastronómica indicada', async () => {
    const restaurantes: RestauranteEntity[] =
      await service.buscarRestaurantesPorCulturaGastronomicaId(
        culturaGastronomica.id,
      );
    expect(restaurantes.length).toBe(5);
  });

  it('asociarRestaurantesCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.asociarRestaurantesCulturaGastronomica('0', [nuevaRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('asociarRestaurantesCulturaGastronomica debe lanzar una excepción para una restaurante inválida', async () => {
    nuevaRestaurante.id = '0';

    await expect(() =>
      service.asociarRestaurantesCulturaGastronomica(culturaGastronomica.id, [
        nuevaRestaurante,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la restaurante con el id indicado',
    );
  });

  it('asociarRestaurantesCulturaGastronomica debe actualizar la lista de restaurantes de una cultura gastronómica', async () => {
    const culturagastronomicaActualizada =
      await service.asociarRestaurantesCulturaGastronomica(
        culturaGastronomica.id,
        [nuevaRestaurante],
      );

    expect(culturagastronomicaActualizada.restaurantes.length).toBe(1);
    expect(culturagastronomicaActualizada.restaurantes[0].nombre).toBe(
      nuevaRestaurante.nombre,
    );
    expect(culturagastronomicaActualizada.restaurantes[0].ciudad).toBe(
      nuevaRestaurante.ciudad,
    );
    expect(
      culturagastronomicaActualizada.restaurantes[0].estrellasMichelin,
    ).toBe(nuevaRestaurante.estrellasMichelin);
    expect(
      culturagastronomicaActualizada.restaurantes[0]
        .anioConsecucionEstrellaMichelin,
    ).toBe(nuevaRestaurante.anioConsecucionEstrellaMichelin);
  });

  it('borrarRestauranteCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    const restaurante = culturaGastronomica.restaurantes[0];
    await expect(() =>
      service.eliminarRestauranteCulturaGastronomica('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('borrarRestauranteCulturaGastronomica debe lanzar una excepción para una restaurante inválida', async () => {
    await expect(() =>
      service.eliminarRestauranteCulturaGastronomica(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la restaurante con el id indicado',
    );
  });

  it('borrarRestauranteCulturaGastronomica debe lanzar una excepción para una restaurante no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.eliminarRestauranteCulturaGastronomica(
        culturaGastronomica.id,
        nuevaRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La restaurante no está relacionada a la cultura gastronómica',
    );
  });

  it('borrarRestauranteCulturaGastronomica debe eliminar la restaurante de la cultura gastronómica', async () => {
    const restaurante: RestauranteEntity = restaurantes[0];

    await service.eliminarRestauranteCulturaGastronomica(
      culturaGastronomica.id,
      restaurante.id,
    );

    const culturagastronomicaGuardada: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomica.id}` },
        relations: ['restaurantes'],
      });
    const restauranteBorrada: RestauranteEntity =
      culturagastronomicaGuardada.restaurantes.find(
        (r) => r.id === restaurante.id,
      );

    expect(restauranteBorrada).toBeUndefined();
  });

  it('buscarRestaurantesPorCulturaGastronomicaId debe retornar todos los paise de una cultura gastronómica', async () => {
    jest.spyOn(service, 'buscarRestaurantesPorCulturaGastronomicaId')
      .mockImplementation(() => Promise.resolve(restaurantes));
    expect(await controller.buscarRestaurantesPorCulturaGastronomicaId(culturaGastronomica.id)).toBe(restaurantes);
  })

  it('buscarRestaurantePorCulturaGastronomicaIdRestauranteId debe retornar una cultura gastronomica por id', async () => {
    jest.spyOn(service, 'buscarRestaurantePorCulturaGastronomicaIdRestauranteId')
      .mockImplementation(() => Promise.resolve(restaurantes[0]))
    expect(await controller
      .buscarRestaurantePorCulturaGastronomicaIdRestauranteId(culturaGastronomica.id, restaurantes[0].id))
      .toBe(restaurantes[0])
  })
});
