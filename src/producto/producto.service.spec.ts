import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { CategoriaProductoService } from '../categoria-producto/categoria-producto.service';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';

describe('ProductoService', () => {
  let service: ProductoService;
  let categoriaProductoService: CategoriaProductoService;
  let repository: Repository<ProductoEntity>;
  let repositoryCategoriaProducto: Repository<CategoriaProductoEntity>;
  let productosList: ProductoEntity[];
  let categoriaProducto: CategoriaProductoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmTestingConfig(),
        CacheModule.register({
          store: sqliteStore,
          path: ':memory:',
          options: {
            ttl: 5,
          },
        }),
      ],
      providers: [ProductoService, CategoriaProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    categoriaProductoService = module.get<CategoriaProductoService>(
      CategoriaProductoService,
    );
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    repositoryCategoriaProducto = module.get<
      Repository<CategoriaProductoEntity>
    >(getRepositoryToken(CategoriaProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    categoriaProducto = await repositoryCategoriaProducto.save({
      nombre: faker.commerce.productAdjective(),
    });
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        historia: faker.lorem.sentence(),
        categoriaProducto: categoriaProducto,
      });
      productosList.push(producto);
    }
  };

  it('Los servicios de productos y categoría de productos deben estar definidos', () => {
    expect(service).toBeDefined();
    expect(categoriaProductoService).toBeDefined();
  });

  it('findAll debe retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne debe retornar un producto a partir de su ID', async () => {
    const productoAlmacenado: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(
      productoAlmacenado.id,
    );
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(productoAlmacenado.nombre);
    expect(producto.descripcion).toEqual(productoAlmacenado.descripcion);
    expect(producto.historia).toEqual(productoAlmacenado.historia);
    expect(producto.categoriaProducto).toEqual(
      productoAlmacenado.categoriaProducto,
    );
  });

  it('findOne debe lanzar una excepción para un producto no válido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('create debe crear un producto nuevo', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
      categoriaProducto: categoriaProducto,
    };

    const productoNuevo: ProductoEntity = await service.create(producto);
    expect(productoNuevo).not.toBeNull();

    const productoAlmacenado: ProductoEntity = await repository.findOne({
      where: { id: `${productoNuevo.id}` },
      relations: ['categoriaProducto'],
    });
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toEqual(productoNuevo.nombre);
    expect(productoAlmacenado.descripcion).toEqual(productoNuevo.descripcion);
    expect(productoAlmacenado.historia).toEqual(productoNuevo.historia);
    expect(productoAlmacenado.categoriaProducto).toEqual(
      productoNuevo.categoriaProducto,
    );
  });

  it('create debe lanzar una excepcion para una categoría de producto no válida', async () => {
    const categoriaProducto: CategoriaProductoEntity = {
      id: '0',
      nombre: 'Nombre',
    };
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
      categoriaProducto: categoriaProducto,
    };
    await expect(() => service.create(producto)).rejects.toHaveProperty(
      'message',
      'No se encontró la categoría de producto con el id suministrado',
    );
  });

  it('update debe modificar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'Nuevo nombre';
    producto.descripcion = 'Nueva descripción';
    producto.historia = 'Nueva historia';
    const productoActualizado: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(productoActualizado).not.toBeNull();
    const productoAlmacenado: ProductoEntity = await repository.findOne({
      where: { id: `${producto.id}` },
    });
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toEqual(producto.nombre);
    expect(productoAlmacenado.descripcion).toEqual(producto.descripcion);
    expect(productoAlmacenado.historia).toEqual(producto.historia);
  });

  it('update debe lanzar una excepcion para un producto no válido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('update debe lanzar una excepcion para una categoría de producto no válida', async () => {
    let producto: ProductoEntity = productosList[0];
    const categoriaProducto: CategoriaProductoEntity = {
      id: '0',
      nombre: 'Nombre',
    };
    producto = {
      ...producto,
      nombre: 'Nuevo nombre',
      categoriaProducto: categoriaProducto,
    };
    await expect(() =>
      service.update(producto.id, producto),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la categoría de producto con el id suministrado',
    );
  });

  it('delete debe eliminar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    const productoEliminado: CategoriaProductoEntity = await repository.findOne(
      { where: { id: `${producto.id}` } },
    );
    expect(productoEliminado).toBeNull();
  });

  it('update debe lanzar una excepcion para un producto no válido', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });
});
