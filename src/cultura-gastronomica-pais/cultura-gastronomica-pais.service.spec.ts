import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';

describe('CulturaGastronomicaPaisService', () => {
  let service: CulturaGastronomicaPaisService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let nuevoPais: PaisEntity;
  let paises: PaisEntity[];

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
      providers: [CulturaGastronomicaPaisService],
    }).compile();

    service = module.get<CulturaGastronomicaPaisService>(
      CulturaGastronomicaPaisService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    paisRepository.clear();

    paises = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save({
        nombre: faker.address.country(),
      });
      paises.push(pais);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      paises: paises,
    });

    nuevoPais = await paisRepository.save({
      nombre: faker.address.country(),
    });
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('agregarPaisCulturaGastronomica debe agregar un nuevo país a la cultura gastronómica', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
    });

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    const resultado: CulturaGastronomicaEntity =
      await service.agregarPaisCulturaGastronomica(
        nuevaCulturaGastronomica.id,
        nuevoPais.id,
      );

    expect(resultado.paises.length).toBe(1);
    expect(resultado.paises[0]).not.toBeNull();
    expect(resultado.paises[0].nombre).toBe(nuevoPais.nombre);
  });

  it('agregarPaisCulturaGastronomica debe lanzar una excepción para un país inválida', async () => {
    await expect(() =>
      service.agregarPaisCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('agregarPaisCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.agregarPaisCulturaGastronomica('0', nuevoPais.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarPaisPorCulturaGastronomicaIdPaisId debe lanzar una excepción para un país inválido', async () => {
    await expect(() =>
      service.buscarPaisPorCulturaGastronomicaIdPaisId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('buscarPaisPorCulturaGastronomicaIdPaisId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarPaisPorCulturaGastronomicaIdPaisId('0', nuevoPais.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarPaisPorCulturaGastronomicaIdPaisId debe lanzar una excepción para un país no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.buscarPaisPorCulturaGastronomicaIdPaisId(
        culturaGastronomica.id,
        nuevoPais.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El país no está relacionada a la cultura gastronómica',
    );
  });

  it('buscarPaisPorCulturaGastronomicaIdPaisId debe retornar el país indicado por la cultura gastronómica indicada', async () => {
    const paisRelacionado: PaisEntity = paises[0];
    const paisGuardado: PaisEntity =
      await service.buscarPaisPorCulturaGastronomicaIdPaisId(
        culturaGastronomica.id,
        paisRelacionado.id,
      );

    expect(paisGuardado).not.toBeNull();
    expect(paisGuardado.nombre).toBe(paisRelacionado.nombre);
  });

  it('buscarPaisesPorCulturaGastronomicaId debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.buscarPaisesPorCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('buscarPaisesPorCulturaGastronomicaId debe retornar los paises relacionadas a la cultura gastronómica indicada', async () => {
    const paises: PaisEntity[] =
      await service.buscarPaisesPorCulturaGastronomicaId(
        culturaGastronomica.id,
      );
    expect(paises.length).toBe(5);
  });

  it('asociarPaisesCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    await expect(() =>
      service.asociarPaisesCulturaGastronomica('0', [nuevoPais]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('asociarPaisesCulturaGastronomica debe lanzar una excepción para una receta inválida', async () => {
    nuevoPais.id = '0';

    await expect(() =>
      service.asociarPaisesCulturaGastronomica(culturaGastronomica.id, [
        nuevoPais,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('asociarPaisesCulturaGastronomica debe actualizar la lista de paises de una cultura gastronómica', async () => {
    const culturagastronomicaActualizada =
      await service.asociarPaisesCulturaGastronomica(culturaGastronomica.id, [
        nuevoPais,
      ]);

    expect(culturagastronomicaActualizada.paises.length).toBe(1);
    expect(culturagastronomicaActualizada.paises[0].nombre).toBe(
      nuevoPais.nombre,
    );
  });

  it('borrarPaisCulturaGastronomica debe lanzar una excepción para una cultura gastronómica inválida', async () => {
    const pais = culturaGastronomica.paises[0];
    await expect(() =>
      service.borrarPaisCulturaGastronomica('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id indicado',
    );
  });

  it('borrarPaisCulturaGastronomica debe lanzar una excepción para una receta inválida', async () => {
    await expect(() =>
      service.borrarPaisCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el país con el id indicado',
    );
  });

  it('borrarPaisCulturaGastronomica debe lanzar una excepción para un país no relacionada a la cultura gastronómica', async () => {
    await expect(() =>
      service.borrarPaisCulturaGastronomica(
        culturaGastronomica.id,
        nuevoPais.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El país no está relacionada a la cultura gastronómica',
    );
  });

  it('borrarPaisCulturaGastronomica debe eliminar el país de la cultura gastronómica', async () => {
    const pais: PaisEntity = paises[0];

    await service.borrarPaisCulturaGastronomica(
      culturaGastronomica.id,
      pais.id,
    );

    const culturagastronomicaGuardada: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomica.id}` },
        relations: ['paises'],
      });
    const paisBorrado: PaisEntity = culturagastronomicaGuardada.paises.find(
      (r) => r.id === pais.id,
    );

    expect(paisBorrado).toBeUndefined();
  });
});
