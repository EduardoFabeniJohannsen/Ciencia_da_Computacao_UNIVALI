CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    cidade VARCHAR(100)
);

--------------------------------------------------
-- TABELA PEDIDOS
--------------------------------------------------
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    data DATE,
    valor NUMERIC(10,2),
    id_cliente INT,
    
    CONSTRAINT fk_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
);

--------------------------------------------------
-- INSERTS CLIENTES
--------------------------------------------------
INSERT INTO clientes (nome, cidade) VALUES
('João Silva', 'SAO PAULO'),
('Maria Souza', 'RIO DE JANEIRO'),
('Carlos Lima', 'SAO PAULO'),
('Ana Costa', 'CURITIBA'),
('Fernanda Alves', 'FLORIANOPOLIS');

--------------------------------------------------
-- INSERTS PEDIDOS
--------------------------------------------------
INSERT INTO pedidos (data, valor, id_cliente) VALUES
('2026-01-10', 2500.00, 1),
('2026-01-15', 7000.00, 1),
('2026-02-01', 3200.00, 2),
('2026-02-05', 8500.00, 3),
('2026-02-10', 1200.00, 3),
('2026-03-01', 9500.00, 4),
('2026-03-12', 15000.00, 1),
('2026-03-20', 4300.00, 5);



/*
Execicio 1-
Faça uma view que retorne uma tabela mostran o ID - NOME - Valor total das vendas
*/

CREATE OR REPLACE VIEW Vlr_total_vendas_por_cliente AS
SELECT 
    c.id_cliente,
    c.cidade,
    c.nome AS cliente,
    SUM(p.valor) AS valor_total_pedidos
FROM clientes c
JOIN pedidos p
    ON c.id_cliente = p.id_cliente
GROUP BY
    c.id_cliente,
    c.cidade,
    c.nome;

SELECT *
FROM Vlr_total_vendas_por_cliente;


/*
Exercicio 2-
Faça uma view que retorne uma tabela mostrando:
CIDADE - Valor total das vendas por cidade
*/

CREATE OR REPLACE VIEW Vlr_total_vendas_por_cidade AS
SELECT
    c.cidade,
    SUM(p.valor) AS valor_total_vendas
FROM clientes c
JOIN pedidos p
    ON c.id_cliente = p.id_cliente
GROUP BY
    c.cidade;

SELECT *
FROM Vlr_total_vendas_por_cidade;