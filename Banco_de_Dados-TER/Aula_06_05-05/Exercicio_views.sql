/*Ver view padrao que vieram do sistema*/
select * from film_list
select * from sales_by_film_category

CREATE OR REPLACE VIEW nome_completo_ator AS
SELECT first_name || ' ' || last_name as nome
FROM ACTOR

SELECT * FROM nome_completo_ator