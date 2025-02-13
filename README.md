<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# API de Gerenciamento de Tarefas

## Descrição

API de gerenciamento de tarefas construída com NestJS e Prisma, permitindo autenticação de usuários e gerenciamento de tarefas pessoais.

## Pré-requisitos

- Node.js (versão 20 ou superior)
- npm
- PostgreSQL
- Docker (opcional)

## Configuração do Projeto

```bash
# Instalação das dependências
$ npm install

# Configure as variáveis de ambiente
$ cp .env.example .env
# Edite o arquivo .env com suas configurações:

# Gere os arquivos do Prisma e execute as migrações
$ npm run prisma:generate
$ npm run prisma:migrate


```

## Executando o Projeto

Você pode executar o projeto de duas formas:

### Utilizando Docker (Alternativa de Configuração)

O Docker oferece uma configuração padronizada e isolada, facilitando a instalação e execução da aplicação sem precisar gerenciar dependências e versões manualmente. Com o Docker, o ambiente de desenvolvimento é replicado de forma consistente em qualquer sistema. Basta executar:

```bash
$ docker-compose up
```

### Pela Linha de Comando

Caso não utilize o Docker, você pode iniciar a aplicação diretamente via npm:

```bash
# desenvolvimento
$ npm run start

# modo watch
$ npm run start:dev

# modo produção
$ npm run start:prod
```

## Testes

```bash
# testes unitários com cobertura
$ npm run test

# testes e2e
$ npm run test:e2e
```

## Endpoints da API

### Autenticação
- `POST /api/v1/auth/sign-up` - Registra um novo usuário
- `POST /api/v1/auth/sign-in` - Autentica um usuário existente

### Tarefas
- `GET /api/v1/tasks` - Lista todas as tarefas do usuário
- `GET /api/v1/tasks/:id` - Obtém uma tarefa específica
- `POST /api/v1/tasks` - Cria uma nova tarefa
- `PUT /api/v1/tasks/:id` - Atualiza uma tarefa
- `DELETE /api/v1/tasks/:id` - Remove uma tarefa

## Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Passport JWT
- Class Validator
- Jest
- Swagger/OpenAPI


## Documentação da API

A documentação completa da API está disponível através do Swagger UI atraves do endpoint:
- `/api`

