/*
1. Quais índices, que não são chave primaria existem no database ?

R: Consulto todos os índices e removo os que são "pk" e "fk".
Resultado encontrado:

actor      → idx_actor_last_name
customer   → idx_last_name
film       → film_fulltext_idx
film       → idx_title
inventory  → idx_store_id_film_id
rental     → idx_unq_rental_rental_date_inventory_id_customer_id
store      → idx_unq_manager_staff_id
*/

SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%fk%'
AND indexname NOT LIKE '%pk%'
ORDER BY tablename, indexname;



/*
2. Caso exista algum índice de data em alguma tabela, usar uma consulta SELECT e verificar se o índice é utilizado.
Se não for utilizado, indicar o possível motivo.

R: Foi feita a busca por índices em campos de data/tempo.
Foi encontrado:

rental → idx_unq_rental_rental_date_inventory_id_customer_id

Teste realizado:
Se aparecer "Index Scan", o índice está sendo utilizado.
Se aparecer "Seq Scan", não está sendo utilizado.

Possíveis motivos para não utilização:
- Tabela pequena
- Baixa seletividade
- Estatísticas desatualizadas
- Forma da consulta não favorece o índice
*/

SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND (indexdef ILIKE '%date%' OR indexdef ILIKE '%time%');

EXPLAIN ANALYZE
SELECT *
FROM rental
WHERE rental_date = '2005-05-24';



/*
3. Busque uma tabela que tenha campo data, crie um índice, indicar qual tabela e mostrar as análises antes e depois da criação do índice.

R:
Tabela utilizada: rental
Campo: return_date

Antes:
Resultado esperado → Seq Scan (varredura completa)

Depois:
Resultado esperado → Index Scan (uso do índice)
*/

-- Antes
EXPLAIN ANALYZE
SELECT *
FROM rental
WHERE return_date = '2005-05-24';

-- Criação do índice
CREATE INDEX idx_rental_return_date
ON rental (return_date);

-- Depois
EXPLAIN ANALYZE
SELECT *
FROM rental
WHERE return_date = '2005-05-24';