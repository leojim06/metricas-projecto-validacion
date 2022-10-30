delete from cultura_gastronomica_entity where id = 'daa36413-4a1d-4d11-b6b6-92090c951d5b';

insert into cultura_gastronomica_entity (id, nombre, descripcion) values ('daa36413-4a1d-4d11-b6b6-92090c951d5b', 'Jast-Harris', 'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.');

CREATE OR REPLACE PROCEDURE producto_entity_traverse() LANGUAGE plpgsql AS $$

declare

producto_rec record;

BEGIN

for producto_rec in (select id from producto_entity pe)

loop

insert
	into
	cultura_gastronomica_entity_productos_producto_entity ("culturaGastronomicaEntityId" ,
	"productoEntityId")
values ('daa36413-4a1d-4d11-b6b6-92090c951d5b',
producto_rec.id);

end loop;

END;

$$;

call producto_entity_traverse();

