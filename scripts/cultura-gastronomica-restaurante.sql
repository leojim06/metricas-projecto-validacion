INSERT into cultura_gastronomica_entity_restaurantes_restaurante_entity
SELECT (
select cultura_gastronomica_entity.id
  from cultura_gastronomica_entity
 order by id asc
 limit 1), restaurante_entity.id
FROM restaurante_entity;