import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaService } from './receta.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from './receta.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetaLista: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetaLista = [];
    for (let i = 0; i < 5; ++i) {
      const receta: RecetaEntity = await repository.save({
        nombre:
          faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
        descripcion: faker.lorem.sentence(),
        instruccionesPreparacion: faker.lorem.sentence(),
        foto: faker.image.food(),
        video: faker.image.food(),
      });
      recetaLista.push(receta);
    }
  };

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('obtenerTodos debe retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.obtenerTodos();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetaLista.length);
  });

  it('obtenerPorId debe retormar una receta por su id', async () => {
    const recetaAletoria: RecetaEntity = recetaLista[0];
    const recetaObtenida: RecetaEntity = await service.obtenerPorId(
      recetaAletoria.id,
    );
    expect(recetaObtenida).not.toBeNull();
    expect(recetaObtenida.nombre).toEqual(recetaAletoria.nombre);
  });

  it('obtenerPorId debe lanzar una excepción para una receta inválida', async () => {
    await expect(() => service.obtenerPorId('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('crear debe retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
      descripcion: faker.lorem.sentence(),
      instruccionesPreparacion: faker.lorem.sentence(),
      foto: faker.image.food(),
      video: faker.image.food(),
      culturaGastronomica: new CulturaGastronomicaEntity(),
    };

    const recetaNueva: RecetaEntity = await service.crear(receta);
    expect(recetaNueva).not.toBeNull();

    const recetaObtenida: RecetaEntity = await repository.findOne({
      where: { id: `${recetaNueva.id}` },
    });
    expect(recetaObtenida).not.toBeNull();
    expect(recetaObtenida.nombre).toEqual(recetaNueva.nombre);
  });

  it('actualizar debe modificar una receta', async () => {
    const recetaAletoria: RecetaEntity = recetaLista[0];
    (recetaAletoria.nombre =
      faker.commerce.productAdjective + ' ' + faker.animal.type() + ' '),
      (recetaAletoria.descripcion = faker.lorem.sentence());
    recetaAletoria.instruccionesPreparacion = faker.lorem.sentence();
    recetaAletoria.foto = faker.image.food();
    recetaAletoria.video = faker.image.food();

    const recetaActualizada: RecetaEntity = await service.actualizar(
      recetaAletoria.id,
      recetaAletoria,
    );

    expect(recetaActualizada).not.toBeNull();
    const recetaGuardada: RecetaEntity = await repository.findOne({
      where: { id: `${recetaActualizada.id}` },
    });
    expect(recetaGuardada).not.toBeNull();
    expect(recetaGuardada.nombre).toEqual(recetaActualizada.nombre);
  });

  it('actualizar debe lanzar una excepción para una receta inválida', async () => {
    let receta: RecetaEntity = recetaLista[0];
    receta = {
      ...receta,
      nombre: faker.commerce.productAdjective + ' ' + faker.animal.type() + ' ',
    };
    await expect(() => service.actualizar('0', receta)).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });

  it('borrar debe quitar la receta', async () => {
    const receta: RecetaEntity = recetaLista[0];
    await service.borrar(receta.id);
    const recetaEliminada: RecetaEntity = await repository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(recetaEliminada).toBeNull();
  });

  it('borrar debe lanzar una excepción para una receta inválida', async () => {
    const receta: RecetaEntity = recetaLista[0];
    await service.borrar(receta.id);
    await expect(() => service.borrar('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la receta con el id indicado',
    );
  });
});
