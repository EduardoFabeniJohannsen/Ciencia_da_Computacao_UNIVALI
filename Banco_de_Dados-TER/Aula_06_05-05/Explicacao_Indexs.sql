/*Conto quatidade de linhas, percebo tabela é pequena*/
select count (*) from address;

/*Consulto e vejo que é lento*/
explain analyse
select * from address where phone = '860452626434';

/*Crio index*/
CREATE INDEX idx_adress_phone
ON address (phone)

/*Consulto e vejo ele funcionand, consulta mais rapida*/
explain analyse
select * from address where phone = '860452626434';

/*Derrubar para teste*/
DROP INDEX idx_adress_phone

