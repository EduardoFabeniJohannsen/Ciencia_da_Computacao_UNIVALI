Uma vez restaurado, deve-se responder a algumas perguntas:

/*1. Quais índices, que não são chave primaria existem no database ?
R:Consulto todos os indexs e removo todos que são "pk" e "fk" Me restando:

"actor"	"idx_actor_last_name"
"customer"	"idx_last_name"
"film"	"film_fulltext_idx"
"film"	"idx_title"
"inventory"	"idx_store_id_film_id"
"rental"	"idx_unq_rental_rental_date_inventory_id_customer_id"
"store"	"idx_unq_manager_staff_id"

*/
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%fk%'
AND indexname NOT LIKE '%pk%'
ORDER BY tablename, indexname;


2. Caso existe algum índice de data em alguma tabela , usar uma consulta select e ver  se o índice é utilizado.
Se náo for utilizado, indicar o possível motivo.
R:



 3. Busque uma tabela que tenha campo data, crie um índice, indicar qual tabela e mostrar as analises antes e depois da criação do índice.
 R: