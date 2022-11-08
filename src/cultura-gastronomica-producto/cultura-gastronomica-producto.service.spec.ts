import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CacheModule } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { CulturaGastronomicaProductoController } from './cultura-gastronomica-producto.controller';

describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let culuraGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let productosList: ProductoEntity[];
  let nuevoProducto: ProductoEntity;
  let controller: CulturaGastronomicaProductoController

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
      providers: [CulturaGastronomicaProductoService],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(
      CulturaGastronomicaProductoService,
    );
    culuraGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));

    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    controller = new CulturaGastronomicaProductoController(service)
    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culuraGastronomicaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        historia: faker.lorem.sentence(),
      });
      productosList.push(producto);
    }

    culturaGastronomica = await culuraGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      productos: productosList,
    });

    nuevoProducto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });
  };

  it('El servicio CulturaGastronomicaProductoService debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('adicionarProductoACulturaGastronomica debe adicionar un producto a una cultura gastronómica', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    const culturaGastronomica: CulturaGastronomicaEntity =
      await culuraGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    const resultado: CulturaGastronomicaEntity =
      await service.adicionarProductoACulturaGastronomica(
        culturaGastronomica.id,
        productoNuevo.id,
      );

    expect(resultado.productos.length).toBe(1);
    expect(resultado.productos[0]).not.toBeNull();
    expect(resultado.productos[0].nombre).toBe(productoNuevo.nombre);
    expect(resultado.productos[0].descripcion).toBe(productoNuevo.descripcion);
    expect(resultado.productos[0].historia).toBe(productoNuevo.historia);
  });

  it('adicionarProductoACulturaGastronomica debe lanzar una excepción para un id de producto no válido', async () => {
    const culturaGastronomicaNueva: CulturaGastronomicaEntity =
      await culuraGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    await expect(() =>
      service.adicionarProductoACulturaGastronomica(
        culturaGastronomicaNueva.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('adicionarProductoACulturaGastronomica debe lanzar una excepción para un id de cultura gastronómica no válido', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    await expect(() =>
      service.adicionarProductoACulturaGastronomica('0', productoNuevo.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id suministrado',
    );
  });

  it('obtenerProductoPorIdCulturaGastronomicaYIdProducto debe retornar un producto asociado a una cultura gastronómica', async () => {
    const producto: ProductoEntity = productosList[0];
    const productoAlmacenado: ProductoEntity =
      await service.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
        culturaGastronomica.id,
        producto.id,
      );
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toBe(producto.nombre);
    expect(productoAlmacenado.descripcion).toBe(producto.descripcion);
    expect(productoAlmacenado.historia).toBe(producto.historia);
  });

  it('obtenerProductoPorIdCulturaGastronomicaYIdProducto debe lanzar una excepción para un producto no válido', async () => {
    await expect(() =>
      service.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('obtenerProductoPorIdCulturaGastronomicaYIdProducto debe lanzar una excepción para una cultura gastronómica no válida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
        '0',
        producto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id suministrado',
    );
  });

  it('obtenerProductoPorIdCulturaGastronomicaYIdProducto debe lanzar una excepción para un producto que no ha sido asociado a una cultura gastronómica', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    await expect(() =>
      service.obtenerProductoPorIdCulturaGastronomicaYIdProducto(
        culturaGastronomica.id,
        productoNuevo.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id suministrado no está asociado a la cultura gastronómica',
    );
  });

  it('obtenerProductosPorIdCulturaGastronomica debe retornar los productos de una cultura gastronómica', async () => {
    const productos: ProductoEntity[] =
      await service.obtenerProductosPorIdCulturaGastronomica(
        culturaGastronomica.id,
      );
    expect(productos.length).toBe(5);
  });

  it('obtenerProductosPorIdCulturaGastronomica debe lanzar una excepción para una cultura gastronómica no válida', async () => {
    await expect(() =>
      service.obtenerProductosPorIdCulturaGastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id suministrado',
    );
  });

  it('asociarProductosCulturaGastronomica debe actualizar la lista de productos asociada a una cultura gastronómica', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    const culturaGastronomicaActualizada: CulturaGastronomicaEntity =
      await service.asociarProductosCulturaGastronomica(
        culturaGastronomica.id,
        [productoNuevo],
      );
    expect(culturaGastronomicaActualizada.productos.length).toBe(1);

    expect(culturaGastronomicaActualizada.productos[0].nombre).toBe(
      productoNuevo.nombre,
    );
    expect(culturaGastronomicaActualizada.productos[0].descripcion).toBe(
      productoNuevo.descripcion,
    );
    expect(culturaGastronomicaActualizada.productos[0].historia).toBe(
      productoNuevo.historia,
    );
  });

  it('asociarProductosCulturaGastronomica debe lanzar una excepcion para una cultura gastronómica no válida', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    await expect(() =>
      service.asociarProductosCulturaGastronomica('0', [productoNuevo]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id suministrado',
    );
  });

  it('asociarProductosCulturaGastronomica debe lanzar una excepcion para un producto no válido', async () => {
    const productoNuevo: ProductoEntity = productosList[0];
    productoNuevo.id = '0';

    await expect(() =>
      service.asociarProductosCulturaGastronomica(culturaGastronomica.id, [
        productoNuevo,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('eliminarProductoCulturaGastronomica debe eliminar un producto de una cultura gastronómica', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.eliminarProductoCulturaGastronomica(
      culturaGastronomica.id,
      producto.id,
    );

    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity =
      await culuraGastronomicaRepository.findOne({
        where: { id: culturaGastronomica.id },
        relations: ['productos'],
      });
    const productoEliminado: ProductoEntity =
      culturaGastronomicaAlmacenada.productos.find((a) => a.id === producto.id);

    expect(productoEliminado).toBeUndefined();
  });

  it('eliminarProductoCulturaGastronomica debe lanzar una excepcion para un producto no válido', async () => {
    await expect(() =>
      service.eliminarProductoCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró el producto con el id suministrado',
    );
  });

  it('eliminarProductoCulturaGastronomica debe lanzar una excepcion para una cultura gastronómica no válida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.eliminarProductoCulturaGastronomica('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró la cultura gastronómica con el id suministrado',
    );
  });

  it('eliminarProductoCulturaGastronomica debe lanzar una excepcion para un producto no asociado a una cultura gastronómica', async () => {
    const productoNuevo: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      historia: faker.lorem.sentence(),
    });

    await expect(() =>
      service.eliminarProductoCulturaGastronomica(
        culturaGastronomica.id,
        productoNuevo.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id suministrado no está asociado a la cultura gastronómica',
    );
  });

  it('obtenerProductosPorIdCulturaGastronomica debe retornar todos los paise de una cultura gastronómica', async () => {
    jest.spyOn(service, 'obtenerProductosPorIdCulturaGastronomica')
      .mockImplementation(() => Promise.resolve(productosList));
    expect(await controller.obtenerProductosPorIdCulturaGastronomica(culturaGastronomica.id)).toBe(productosList);
  })

  it('obtenerProductoPorIdCulturaGastronomicaYIdProducto debe retornar una cultura gastronomica por id', async () => {
    jest.spyOn(service, 'obtenerProductoPorIdCulturaGastronomicaYIdProducto')
      .mockImplementation(() => Promise.resolve(productosList[0]))
    expect(await controller
      .obtenerProductoPorIdCulturaGastronomicaYIdProducto(culturaGastronomica.id, productosList[0].id))
      .toBe(productosList[0])
  })

  it('agregarPaisCulturaGastronomica debe asociar un producto con una cultura gastronomica', async () => {
    jest.spyOn(service, 'adicionarProductoACulturaGastronomica').mockImplementation(() => Promise.resolve(culturaGastronomica))
    expect(await controller.adicionarProductoACulturaGastronomica(culturaGastronomica.id, nuevoProducto.id)).toBe(culturaGastronomica)
  })

  it('eliminarProductoCulturaGastronomica debe eliminar un producto de una cultura gastronomica un pais', async () => {
    jest.spyOn(service, 'eliminarProductoCulturaGastronomica').mockImplementation(() => Promise.resolve(culturaGastronomica))
    expect(await controller.deleteArtworkMuseum(culturaGastronomica.id, productosList[0].id)).toBe(culturaGastronomica)
  })
});
