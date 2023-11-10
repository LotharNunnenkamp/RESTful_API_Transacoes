Este projeto foi feito como desafio do módulo 3 do curso de Desenvolvedor Back-End JavaScript da [<img src="https://assets-global.website-files.com/6092ed75cac3156e208ac5e9/60930427ef6bdd04bf838d53_logo-horizontal-academy2.svg" height="18" />](https://cubos.academy/) .

Neste projeto aplicamos os conceitos aprendidos de:
 - RESTful API
 - Consultas SQL
 - CRUD SQL
 - Conexão Node.js com PostgreSQL
 - Autenticação e Criptografia
 

## Descrição do desafio

O desafio consiste em construir uma RESTful API que permita:

- Cadastrar Usuário
- Fazer Login
- Detalhar Perfil do Usuário Logado
- Editar Perfil do Usuário Logado
- Listar categorias
- Listar transações
- Detalhar transação
- Cadastrar transação
- Editar transação
- Remover transação
- Obter extrato de transações
- Filtrar transações por categoria

## Banco de dados

Um Banco de Dados PostgreSQL foi criado contendo as seguintes tabelas e colunas:  

- usuarios
  - id
  - nome
  - email (campo único)
  - senha
- categorias
  - id
  - descricao
- transacoes
  - id
  - descricao
  - valor
  - data
  - categoria_id
  - usuario_id
  - tipo

### Categorias cadastradas

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas
