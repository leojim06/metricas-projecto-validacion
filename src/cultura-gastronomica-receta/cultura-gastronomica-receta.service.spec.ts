import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaRecetaController } from './cultura-gastronomica-receta.controller';

describe('CulturaGastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let nuevaReceta: RecetaEntity;
  let recetas: RecetaEntity[];
  let controller: CulturaGastronomicaRecetaController;

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
      providers: [CulturaGastronomicaRecetaService],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(
      CulturaGastronomicaRecetaService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    controller = new CulturaGastronomicaRecetaController(service);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    recetaRepository.clear();

    recetas = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        instruccionesPreparacion: faker.lorem.sentences(3),
        foto: faker.image.imageUrl(),
        video: faker.internet.url(),
      });
      recetas.push(receta);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: recetas,
    });

    nuevaReceta = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      instruccionesPreparacion: faker.lorem.sentences(3),
      foto: faker.image.imageUrl(),
      video: faker.internet.url(),
    });
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('agregarRecetaCulturaGastronomica debe agregar una nueva receta a la cultura gastronómica', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      instruccionesPreparacion: faker.lorem.sentences(3),
      foto: faker.image.imageUrl(),
      video: faker.internet.url(),
    });

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    const resultado: CulturaGastronomicaEntity =
      await service.agregarRecetaCulturaGastronomica(
        nuevaCulturaGastronomica.id,
        nuevaReceta.id,
      );

    expect(resultado.recetas.length).toBe(1);
    expect(resultado.recetas[0]).not.toBeNull();
    expect(resultado.recetas[0].nombre).toBe(nuevaReceta.nombre);
    expect(resultado.recetas[0].descripcion).toBe(nuevaReceta.descripcion);
    expect(resultado.recetas[0].instruccionesPreparacion).toBe(
      nuevaReceta.instruccionesPreparacion,
    );
    expect(resultado.recetas[0].foto).toBe(nuevaReceta.foto);
    expect(resultado.recetas[0].video).toBe(nuevaReceta.video);
  });

  it('agregarRecetaCulturaGastronomica debe lanzar una excepción para una receta inválida', async () => {
    await expect(() =>
      service.agregarRecetaCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('agregarRecetaCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.agregarRecetaCulturaGastronomica('0', nuevaReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRecetaPorCulturaGastronomicaIdRecetaId debe lanzar una excepción para una receta inválida', async () => {
    await expect(() =>
      service.buscarRecetaPorCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('buscarRecetaPorCulturaGastronomicaIdRecetaId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarRecetaPorCulturaGastronomicaIdRecetaId('0', nuevaReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRecetaPorCulturaGastronomicaIdRecetaId debe lanzar una excepción para una receta no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.buscarRecetaPorCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        nuevaReceta.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta no está relacionada a la cultura gastronómica',
    );
  });

  it('buscarRecetaPorCulturaGastronomicaIdRecetaId debe retornar la receta indicada por la cultura gastronómica indicada', async () => {
    const recetaRelacionada: RecetaEntity = recetas[0];
    const recetaGuardada: RecetaEntity =
      await service.buscarRecetaPorCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        recetaRelacionada.id,
      );

    expect(recetaGuardada).not.toBeNull();
    expect(recetaGuardada.nombre).toBe(recetaRelacionada.nombre);
    expect(recetaGuardada.descripcion).toBe(recetaRelacionada.descripcion);
    expect(recetaGuardada.instruccionesPreparacion).toBe(
      recetaRelacionada.instruccionesPreparacion,
    );
    expect(recetaGuardada.foto).toBe(recetaRelacionada.foto);
    expect(recetaGuardada.video).toBe(recetaRelacionada.video);
  });

  it('buscarRecetasPorCulturaGastronomicaId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarRecetasPorCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarRecetasPorCulturaGastronomicaId debe retornar las recetas relacionadas a la cultura gastronómica indicada', async () => {
    const recetas: RecetaEntity[] =
      await service.buscarRecetasPorCulturaGastronomicaId(
        culturaGastronomica.id,
      );
    expect(recetas.length).toBe(5);
  });

  it('asociarRecetasCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.asociarRecetasCulturaGastronomica('0', [nuevaReceta]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('asociarRecetasCulturaGastronomica debe lanzar una excepción para una receta inválida', async () => {
    nuevaReceta.id = '0';

    await expect(() =>
      service.asociarRecetasCulturaGastronomica(culturaGastronomica.id, [
        nuevaReceta,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('asociarRecetasCulturaGastronomica debe actualizar la lista de recetas de una cultura gastronómica', async () => {
    const culturagastronomicaActualizada =
      await service.asociarRecetasCulturaGastronomica(culturaGastronomica.id, [
        nuevaReceta,
      ]);

    expect(culturagastronomicaActualizada.recetas.length).toBe(1);
    expect(culturagastronomicaActualizada.recetas[0].nombre).toBe(
      nuevaReceta.nombre,
    );
    expect(culturagastronomicaActualizada.recetas[0].descripcion).toBe(
      nuevaReceta.descripcion,
    );
    expect(
      culturagastronomicaActualizada.recetas[0].instruccionesPreparacion,
    ).toBe(nuevaReceta.instruccionesPreparacion);
    expect(culturagastronomicaActualizada.recetas[0].foto).toBe(
      nuevaReceta.foto,
    );
    expect(culturagastronomicaActualizada.recetas[0].video).toBe(
      nuevaReceta.video,
    );
  });

  it('borrarRecetaCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    const receta = culturaGastronomica.recetas[0];
    await expect(() =>
      service.borrarRecetaCulturaGastronomica('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('borrarRecetaCulturaGastronomica debe lanzar una excepción para una receta inválida', async () => {
    await expect(() =>
      service.borrarRecetaCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('borrarRecetaCulturaGastronomica debe lanzar una excepción para una receta no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.borrarRecetaCulturaGastronomica(
        culturaGastronomica.id,
        nuevaReceta.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta no está relacionada a la cultura gastronómica',
    );
  });

  it('borrarRecetaCulturaGastronomica debe eliminar la receta de la cultura gastronómica', async () => {
    const receta: RecetaEntity = recetas[0];

    await service.borrarRecetaCulturaGastronomica(
      culturaGastronomica.id,
      receta.id,
    );

    const culturagastronomicaGuardada: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomica.id}` },
        relations: ['recetas'],
      });
    const recetaBorrada: RecetaEntity =
      culturagastronomicaGuardada.recetas.find((r) => r.id === receta.id);

    expect(recetaBorrada).toBeUndefined();
  });

  it('buscarPaisesPorCulturaGastronomicaId debe retornar todos los paise de una cultura gastronómica', async () => {
    jest.spyOn(service, 'buscarRecetasPorCulturaGastronomicaId')
      .mockImplementation(() => Promise.resolve(recetas));
    expect(await controller.buscarRecetasPorCulturaGastronomicaId(culturaGastronomica.id)).toBe(recetas);
  })

  it('obtenerPorId debe retornar una cultura gastronomica por id', async () => {
    jest.spyOn(service, 'buscarRecetaPorCulturaGastronomicaIdRecetaId')
      .mockImplementation(() => Promise.resolve(recetas[0]))
    expect(await controller
      .buscarRecetaPorCulturaGastronomicaIdRecetaId(culturaGastronomica.id, recetas[0].id))
      .toBe(recetas[0])
  })

  it('buscarRecetasPorCulturaGastronomicaId debe retornar todos los paise de una cultura gastronómica', async () => {
    jest.spyOn(service, 'buscarRecetasPorCulturaGastronomicaId')
      .mockImplementation(() => Promise.resolve(recetas));
    expect(await controller.buscarRecetasPorCulturaGastronomicaId(culturaGastronomica.id)).toBe(recetas);
  })

  it('buscarRecetaPorCulturaGastronomicaIdRecetaId debe retornar una cultura gastronomica por id', async () => {
    jest.spyOn(service, 'buscarRecetaPorCulturaGastronomicaIdRecetaId')
      .mockImplementation(() => Promise.resolve(recetas[0]))
    expect(await controller
      .buscarRecetaPorCulturaGastronomicaIdRecetaId(culturaGastronomica.id, recetas[0].id))
      .toBe(recetas[0])
  })
});
