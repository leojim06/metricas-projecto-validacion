import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';
import { faker } from '@faker-js/faker';
import { CategoriaProductoController } from './categoria-producto.controller';

describe('CategoriaProductoService', () => {
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

  it('El servicio de categoría de productos be estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las categorías de producto', async () => {
    const categoriasProducto: CategoriaProductoEntity[] =
      await service.findAll();
    expect(categoriasProducto).not.toBeNull();
    expect(categoriasProducto).toHaveLength(categoriasProductoList.length);
  });

  it('findOne debe retornar una cateoría de producto a partir de su ID', async () => {
    const categoriaProductoAlmacenada: CategoriaProductoEntity =
      categoriasProductoList[0];
    const categoriaProducto: CategoriaProductoEntity = await service.findOne(
      categoriaProductoAlmacenada.id,
    );
    expect(categoriaProducto).not.toBeNull();
    expect(categoriaProducto.nombre).toEqual(
      categoriaProductoAlmacenada.nombre,
    );
  });

  it('findOne debe lanzar una excepción para una categoría de producto no válida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la categoría de producto con el id suministrado',
    );
  });

  it('create debe crear una nueva categoría de producto', async () => {
    const categoriaProducto: CategoriaProductoEntity = {
      id: '',
      nombre: faker.commerce.productAdjective(),
      productos: [],
    };

    const categoriaProductoNueva: CategoriaProductoEntity =
      await service.create(categoriaProducto);
    expect(categoriaProductoNueva).not.toBeNull();

    const categoriaProductoAlmacenada: CategoriaProductoEntity =
      await repository.findOne({
        where: { id: `${categoriaProductoNueva.id}` },
      });
    expect(categoriaProductoAlmacenada).not.toBeNull();
    expect(categoriaProductoAlmacenada.nombre).toEqual(
      categoriaProductoNueva.nombre,
    );
  });

  it('update debe modificar una categoría de producto', async () => {
    const categoriaProducto: CategoriaProductoEntity =
      categoriasProductoList[0];
    categoriaProducto.nombre = 'Nuevo nombre';
    const categoriaProductoActualizada: CategoriaProductoEntity =
      await service.update(categoriaProducto.id, categoriaProducto);
    expect(categoriaProductoActualizada).not.toBeNull();
    const categoriaProductoAlmacenada: CategoriaProductoEntity =
      await repository.findOne({ where: { id: `${categoriaProducto.id}` } });
    expect(categoriaProductoAlmacenada).not.toBeNull();
    expect(categoriaProductoAlmacenada.nombre).toEqual(
      categoriaProducto.nombre,
    );
  });

  it('update debe lanzar una excepcion por una categoría de producto no válida', async () => {
    let categoriaProducto: CategoriaProductoEntity = categoriasProductoList[0];
    categoriaProducto = {
      ...categoriaProducto,
      nombre: 'Nuevo nombre',
    };
    await expect(() =>
      service.update('0', categoriaProducto),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la categoría de producto con el id suministrado',
    );
  });

  it('delete debe eliminar una categoria de producto', async () => {
    const categoriaProducto: CategoriaProductoEntity =
      categoriasProductoList[0];
    await service.delete(categoriaProducto.id);
    const categoriaProductoEliminada: CategoriaProductoEntity =
      await repository.findOne({ where: { id: `${categoriaProducto.id}` } });
    expect(categoriaProductoEliminada).toBeNull();
  });

  it('delete debe lanzar una excepcion por una categoria de producto no valida', async () => {
    const categoriaProducto: CategoriaProductoEntity =
      categoriasProductoList[0];
    await service.delete(categoriaProducto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontró la categoría de producto con el id suministrado',
    );
  });
});
