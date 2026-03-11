// Código para aprender conceitos de TRIGGER e funções no SQL

/*Creates para criar tabelas*/
	CREATE TABLE Funcionario 
		(ID serial primary key, 
		 nome text, 
		 salario numeric (10,2)
		);
	CREATE TABLE Funcionario_log 
		(ID serial primary key,
		id_funcionario int, 
		nome_antigo text, 
		nome_novo   text, 
		salario_antigo numeric (10,2), 
		salario_novo   numeric (10,2), 
		data_alteracao TIMESTAMPTZ NOT NULL DEFAULT now() -- timestamptz inclui fuso horário
		);

	/*Selects para tete*/
	SELECT * FROM Funcionario;
	SELECT * FROM Funcionario_log;


	/*Inser de dados ficticios para teste*/
	INSERT INTO Funcionario (nome,salario) VALUES
	('Alan do TI',50000),
	('Kaun David Leal',1614)
	;  

	/*Updates para teste*/
	UPDATE Funcionario 
		set salario = 12650 
		WHERE id = 2;
	UPDATE Funcionario 
		set nome = 'Peleleca com cabelo branco' 
		WHERE id = 1;


	/*INICIO Log alteração de Salario */
	CREATE OR REPLACE FUNCTION Registrar_Log_Alteracao_de_Salario()
	RETURNS TRIGGER AS $$
	BEGIN
		INSERT INTO Funcionario_log (id_funcionario, salario_antigo,salario_novo, data_alteracao) 
		VALUES (old.id,old.salario,new.salario, now()); 
	RETURN NEW; 
	END; $$ LANGUAGE plpgsql;   

	CREATE TRIGGER Rastrear_Alteracao_de_Salario
	BEFORE UPDATE 
	ON Funcionario
	FOR EACH ROW
	WHEN (old.salario <> new.salario)
	EXECUTE FUNCTION Registrar_Log_Alteração_de_Salario();
	/*FIM Log alteração de Salario */

	/*INICIO Log alteração de Nome */
	CREATE OR REPLACE FUNCTION Registrar_Log_Alteracao_de_Nome()
	RETURNS TRIGGER AS $$
	BEGIN
		INSERT INTO Funcionario_log (id_funcionario, nome_antigo,nome_novo, data_alteracao) 
		VALUES (old.id,old.nome,new.nome, now()); 
	RETURN NEW; 
	END; $$ LANGUAGE plpgsql; 

	CREATE TRIGGER Rastrear_Alteracao_de_Nome
	AFTER UPDATE 
	ON Funcionario
	FOR EACH ROW
	WHEN (old.nome IS DISTINCT FROM new.nome)
	EXECUTE FUNCTION Registrar_Log_Alteracao_de_Nome();
	/*FIM Log alteração de Nome */
