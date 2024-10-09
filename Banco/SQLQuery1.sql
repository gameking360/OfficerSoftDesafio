create database OfficerSoft;

use OfficerSoft;

create table Usuario(
id integer primary key identity,
usuario varchar(100),
cargo varchar(100),
senha varchar(max))

create table Pessoa (
id integer primary key identity,
id_Endereco integer,
cpf varchar (11) unique,
nome varchar(50),
RG varchar(15),
foreign key(id_Endereco) references Endereco(id));

create table Endereco(
id integer primary key identity,
cep varchar(20),
endereco varchar(50),
numero integer,
bairro varchar(50),
complemento varchar (20),
municipio varchar(100),
UF char(2))


drop table Endereo
drop database OfficerSoft

select * from Pessoa;
select * from Usuario;
select * from Endereco;

delete from Endereco;
delete from Pessoa;
delete from Usuario;

delete from Usuario where id = 3;

